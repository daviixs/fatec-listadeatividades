package com.seucalendarioacademico.controller;

import com.seucalendarioacademico.dto.VotacaoCancelamentoResponse;
import com.seucalendarioacademico.dto.VotoRequest;
import com.seucalendarioacademico.dto.VotoResponse;
import com.seucalendarioacademico.service.VotacaoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/atividades/{atividadeId}/votacao")
public class VotacaoController {

    private final VotacaoService votacaoService;

    public VotacaoController(VotacaoService votacaoService) {
        this.votacaoService = votacaoService;
    }

    @PostMapping
    public ResponseEntity<VotacaoCancelamentoResponse> abrirVotacao(@PathVariable Long atividadeId) {
        VotacaoCancelamentoResponse votacao = votacaoService.abrirVotacao(atividadeId);
        return ResponseEntity.ok(votacao);
    }

    @GetMapping
    public ResponseEntity<VotacaoCancelamentoResponse> buscarVotacao(@PathVariable Long atividadeId,
                                                                     HttpServletRequest request) {
        Optional<VotacaoCancelamentoResponse> votacao = votacaoService.buscarVotacao(atividadeId, request.getRemoteAddr());
        return ResponseEntity.of(votacao);
    }

    @PostMapping("/votos")
    public ResponseEntity<VotoResponse> registrarVoto(@PathVariable Long atividadeId,
                                                      @RequestParam(required = false) Long alunoId,
                                                      @Valid @RequestBody VotoRequest request,
                                                      HttpServletRequest httpRequest) {
        VotoResponse voto = votacaoService.registrarVoto(atividadeId, alunoId, request, httpRequest.getRemoteAddr());
        return ResponseEntity.ok(voto);
    }
}
