package com.seucalendarioacademico.service;

import com.seucalendarioacademico.entity.*;
import com.seucalendarioacademico.repository.*;
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
    private final LembreteTemplateRenderer templateRenderer;
    private final SalaDeAulaRepository salaRepository;

    public LembreteDispatchService(
            LembreteAssinanteRepository assinanteRepository,
            LembreteAssinanteSalaRepository assinanteSalaRepository,
            LembreteEnvioJobRepository jobRepository,
            LembreteEnvioItemRepository itemRepository,
            AtividadeRepository atividadeRepository,
            ResendClient resendClient,
            LembreteTemplateRenderer templateRenderer,
            SalaDeAulaRepository salaRepository
    ) {
        this.assinanteRepository = assinanteRepository;
        this.assinanteSalaRepository = assinanteSalaRepository;
        this.jobRepository = jobRepository;
        this.itemRepository = itemRepository;
        this.atividadeRepository = atividadeRepository;
        this.resendClient = resendClient;
        this.templateRenderer = templateRenderer;
        this.salaRepository = salaRepository;
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

        Map<String, List<Atividade>> porSala = pendentes.stream()
                .collect(Collectors.groupingBy(a -> a.getMateria().getSala().getNome()));

        String html = templateRenderer.render(porSala);
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

    @Transactional
    public void enviarResumoDireto(String email, List<Integer> salaIdsParam) {
        List<Integer> salaIds;
        if (salaIdsParam == null || salaIdsParam.isEmpty()) {
            salaIds = salaRepository.findAll().stream()
                    .map(SalaDeAula::getId)
                    .toList();
        } else {
            salaIds = salaIdsParam;
        }

        if (salaIds.isEmpty()) {
            throw new IllegalArgumentException("Nenhuma sala informada ou cadastrada para envio");
        }

        List<Atividade> pendentes = atividadeRepository.findPendentesBySalaIds(
                salaIds,
                StatusAtividade.ATIVA,
                LocalDate.now(ZoneId.of("America/Sao_Paulo"))
        );

        if (pendentes.isEmpty()) {
            throw new IllegalArgumentException("Não há atividades pendentes para as salas informadas");
        }

        Map<String, List<Atividade>> porSala = pendentes.stream()
                .collect(Collectors.groupingBy(a -> a.getMateria().getSala().getNome()));

        String html = templateRenderer.render(porSala);
        String subject = "Resumo de atividades pendentes";
        resendClient.enviar(email, subject, html);

        log.info("Email ad-hoc enviado para {} com {} salas", email, porSala.size());
    }

}
