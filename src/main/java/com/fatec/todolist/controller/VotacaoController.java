package com.fatec.todolist.controller;

import com.fatec.todolist.dto.VotacaoCancelamentoResponse;
import com.fatec.todolist.dto.VotoRequest;
import com.fatec.todolist.dto.VotoResponse;
import com.fatec.todolist.service.VotacaoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

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
    public ResponseEntity<VotacaoCancelamentoResponse> buscarVotacao(@PathVariable Long atividadeId) {
        Optional<VotacaoCancelamentoResponse> votacao = votacaoService.buscarVotacao(atividadeId);
        return ResponseEntity.of(votacao);
    }

    @PostMapping("/votos")
    public ResponseEntity<VotoResponse> registrarVoto(@PathVariable Long atividadeId,
                                                      @RequestParam Long alunoId,
                                                      @Valid @RequestBody VotoRequest request) {
        VotoResponse voto = votacaoService.registrarVoto(atividadeId, alunoId, request);
        return ResponseEntity.ok(voto);
    }
}
