package com.fatec.todolist.service;

import com.fatec.todolist.entity.*;
import com.fatec.todolist.repository.*;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class LembreteDispatchService {

    private static final Logger log = LoggerFactory.getLogger(LembreteDispatchService.class);

    private final LembreteAssinanteRepository assinanteRepository;
    private final LembreteAssinanteSalaRepository assinanteSalaRepository;
    private final LembreteEnvioJobRepository jobRepository;
    private final LembreteEnvioItemRepository itemRepository;
    private final AtividadeRepository atividadeRepository;
    private final ResendClient resendClient;

    public LembreteDispatchService(
            LembreteAssinanteRepository assinanteRepository,
            LembreteAssinanteSalaRepository assinanteSalaRepository,
            LembreteEnvioJobRepository jobRepository,
            LembreteEnvioItemRepository itemRepository,
            AtividadeRepository atividadeRepository,
            ResendClient resendClient
    ) {
        this.assinanteRepository = assinanteRepository;
        this.assinanteSalaRepository = assinanteSalaRepository;
        this.jobRepository = jobRepository;
        this.itemRepository = itemRepository;
        this.atividadeRepository = atividadeRepository;
        this.resendClient = resendClient;
    }

    @Transactional
    public void processarJanelaAtual() {
        LocalDateTime agora = LocalDateTime.now(ZoneId.of("America/Sao_Paulo"));
        LocalDateTime slotInicio = agora.withMinute(0).withSecond(0).withNano(0);
        LocalDateTime slotFim = slotInicio.plusHours(12);

        LembreteEnvioJob job = jobRepository.findBySlotInicio(slotInicio)
                .orElseGet(() -> {
                    LembreteEnvioJob novo = new LembreteEnvioJob();
                    novo.setSlotInicio(slotInicio);
                    novo.setSlotFim(slotFim);
                    novo.setStatus(LembreteJobStatus.PENDING);
                    return jobRepository.save(novo);
                });

        if (job.getStatus() == LembreteJobStatus.DONE || job.getStatus() == LembreteJobStatus.RUNNING) {
            log.info("Job {} ja processado ou em andamento, ignorando", job.getId());
            return;
        }

        job.setStatus(LembreteJobStatus.RUNNING);
        jobRepository.save(job);

        log.info("Iniciando processamento do job {} para slot {}", job.getId(), slotInicio);

        boolean houveFalha = false;

        for (LembreteAssinante assinante : assinanteRepository.findByAtivoTrue()) {
            try {
                processarAssinante(job, assinante);
            } catch (Exception e) {
                houveFalha = true;
                log.error("Erro ao processar assinante {}: {}", assinante.getEmail(), e.getMessage(), e);
            }
        }

        job.setStatus(houveFalha ? LembreteJobStatus.PARTIAL : LembreteJobStatus.DONE);
        job.setDataFim(LocalDateTime.now(ZoneId.of("America/Sao_Paulo")));
        jobRepository.save(job);

        log.info("Finalizando job {} com status {}", job.getId(), job.getStatus());
    }

    private void processarAssinante(LembreteEnvioJob job, LembreteAssinante assinante) {
        LembreteEnvioItem item = itemRepository.findByJobIdAndAssinanteId(job.getId(), assinante.getId())
                .orElseGet(() -> {
                    LembreteEnvioItem novo = new LembreteEnvioItem();
                    novo.setJob(job);
                    novo.setAssinante(assinante);
                    novo.setStatus(LembreteItemStatus.PENDING);
                    return itemRepository.save(novo);
                });

        if (item.getStatus() == LembreteItemStatus.SENT || item.getStatus() == LembreteItemStatus.SKIPPED_NO_PENDING) {
            log.debug("Item {} ja processado, ignorando", item.getId());
            return;
        }

        List<Integer> salaIds = assinanteSalaRepository.findByAssinanteIdAndAtivoTrue(assinante.getId())
                .stream()
                .map(pref -> pref.getSala().getId())
                .toList();

        if (salaIds.isEmpty()) {
            item.setStatus(LembreteItemStatus.SKIPPED_NO_PENDING);
            itemRepository.save(item);
            log.debug("Assinante {} nao tem salas ativas, ignorando", assinante.getEmail());
            return;
        }

        List<Atividade> pendentes = atividadeRepository.findPendentesBySalaIds(
                salaIds,
                StatusAtividade.ATIVA,
                LocalDate.now(ZoneId.of("America/Sao_Paulo"))
        );

        if (pendentes.isEmpty()) {
            item.setStatus(LembreteItemStatus.SKIPPED_NO_PENDING);
            itemRepository.save(item);
            log.debug("Assinante {} nao tem pendencias, ignorando", assinante.getEmail());
            return;
        }

        String html = montarHtmlConsolidado(pendentes);
        String subject = "Resumo de atividades pendentes";
        String messageId = resendClient.enviar(assinante.getEmail(), subject, html);

        item.setStatus(LembreteItemStatus.SENT);
        item.setProvedorMessageId(messageId);
        item.setErro(null);
        itemRepository.save(item);

        assinante.setUltimoEnvio(LocalDateTime.now(ZoneId.of("America/Sao_Paulo")));
        assinanteRepository.save(assinante);

        log.info("Email enviado para assinante {} com messageId {}", assinante.getEmail(), messageId);
    }

    private String montarHtmlConsolidado(List<Atividade> pendentes) {
        Map<String, List<Atividade>> porSala = pendentes.stream()
                .collect(Collectors.groupingBy(a -> a.getMateria().getSala().getNome()));

        StringBuilder sb = new StringBuilder();
        sb.append("<h2>Atividades pendentes</h2>");
        sb.append("<p>Resumo consolidado das suas salas selecionadas.</p>");

        for (Map.Entry<String, List<Atividade>> entry : porSala.entrySet()) {
            sb.append("<h3>").append(entry.getKey()).append("</h3><ul>");
            for (Atividade a : entry.getValue()) {
                sb.append("<li>")
                        .append(a.getMateria().getNome())
                        .append(" - ")
                        .append(a.getTitulo())
                        .append(" (prazo: ")
                        .append(a.getPrazo())
                        .append(")")
                        .append("</li>");
            }
            sb.append("</ul>");
        }

        return sb.toString();
    }
}
