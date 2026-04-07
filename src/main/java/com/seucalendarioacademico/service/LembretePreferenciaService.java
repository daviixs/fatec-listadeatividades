package com.seucalendarioacademico.service;

import com.seucalendarioacademico.dto.LembretePreferenciasRequest;
import com.seucalendarioacademico.dto.LembretePreferenciasResponse;
import com.seucalendarioacademico.entity.LembreteAssinante;
import com.seucalendarioacademico.entity.LembreteAssinanteSala;
import com.seucalendarioacademico.entity.SalaDeAula;
import com.seucalendarioacademico.exception.RecursoNaoEncontradoException;
import com.seucalendarioacademico.repository.LembreteAssinanteRepository;
import com.seucalendarioacademico.repository.LembreteAssinanteSalaRepository;
import com.seucalendarioacademico.repository.SalaDeAulaRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class LembretePreferenciaService {

    private static final Logger log = LoggerFactory.getLogger(LembretePreferenciaService.class);

    private final LembreteAssinanteRepository assinanteRepository;
    private final LembreteAssinanteSalaRepository assinanteSalaRepository;
    private final SalaDeAulaRepository salaRepository;
    private final LembreteBoasVindasTemplateRenderer boasVindasTemplateRenderer;
    private final ResendClient resendClient;

    public LembretePreferenciaService(
            LembreteAssinanteRepository assinanteRepository,
            LembreteAssinanteSalaRepository assinanteSalaRepository,
            SalaDeAulaRepository salaRepository,
            LembreteBoasVindasTemplateRenderer boasVindasTemplateRenderer,
            ResendClient resendClient
    ) {
        this.assinanteRepository = assinanteRepository;
        this.assinanteSalaRepository = assinanteSalaRepository;
        this.salaRepository = salaRepository;
        this.boasVindasTemplateRenderer = boasVindasTemplateRenderer;
        this.resendClient = resendClient;
    }

    @Transactional
    public LembretePreferenciasResponse salvar(LembretePreferenciasRequest request) {
        boolean novoAssinante = !assinanteRepository.existsByEmail(request.email());

        LembreteAssinante assinante = assinanteRepository.findByEmail(request.email())
                .orElseGet(() -> {
                    LembreteAssinante novo = new LembreteAssinante();
                    novo.setEmail(request.email());
                    novo.setAtivo(true);
                    return assinanteRepository.save(novo);
                });

        List<SalaDeAula> salas = salaRepository.findAllById(request.salaIds());
        if (salas.size() != request.salaIds().size()) {
            throw new RecursoNaoEncontradoException("Uma ou mais salas nao existem");
        }

        assinante.setAtivo(true);
        assinanteRepository.save(assinante);

        assinanteSalaRepository.deleteByAssinanteId(assinante.getId());
        for (SalaDeAula sala : salas) {
            LembreteAssinanteSala pref = new LembreteAssinanteSala();
            pref.setAssinante(assinante);
            pref.setSala(sala);
            pref.setAtivo(true);
            assinanteSalaRepository.save(pref);
        }

        if (novoAssinante && !salas.isEmpty()) {
            try {
                String html = boasVindasTemplateRenderer.render(salas);
                resendClient.enviar(
                        assinante.getEmail(),
                        "Bem-vindo(a)! Você está cadastrado para receber avisos",
                        html
                );
            } catch (Exception e) {
                log.warn("Falha ao enviar email de boas-vindas para {}: {}", assinante.getEmail(), e.getMessage());
            }
        }

        return buscarPorEmail(assinante.getEmail());
    }

    public LembretePreferenciasResponse buscarPorEmail(String email) {
        LembreteAssinante assinante = assinanteRepository.findByEmail(email)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Assinante nao encontrado"));

        Set<Integer> salaIds = assinanteSalaRepository.findByAssinanteIdAndAtivoTrue(assinante.getId())
                .stream()
                .map(p -> p.getSala().getId())
                .collect(Collectors.toSet());

        return new LembretePreferenciasResponse(
                assinante.getId(),
                assinante.getEmail(),
                assinante.getAtivo(),
                salaIds.stream().sorted().toList(),
                assinante.getUltimoEnvio()
        );
    }

    @Transactional
    public void desativar(String email) {
        LembreteAssinante assinante = assinanteRepository.findByEmail(email)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Assinante nao encontrado"));
        assinante.setAtivo(false);
        assinanteRepository.save(assinante);
    }

    public void enviarEmailBoasVindas(String email, List<Integer> salaIds) {
        List<SalaDeAula> salas = salaRepository.findAllById(salaIds);
        if (salas.isEmpty()) {
            throw new RecursoNaoEncontradoException("Nenhuma sala encontrada para os IDs informados");
        }

        String html = boasVindasTemplateRenderer.render(salas);
        resendClient.enviar(
                email,
                "Bem-vindo(a)! Você está cadastrado para receber avisos",
                html
        );
    }
}
