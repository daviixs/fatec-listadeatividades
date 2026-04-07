package com.seucalendarioacademico.controller;

import com.seucalendarioacademico.dto.AdminLoginRequest;
import com.seucalendarioacademico.dto.AdminLoginResponse;
import com.seucalendarioacademico.dto.AtividadeRequest;
import com.seucalendarioacademico.dto.AtividadeResponse;
import com.seucalendarioacademico.entity.SalaDeAula;
import com.seucalendarioacademico.exception.RecursoNaoEncontradoException;
import com.seucalendarioacademico.repository.SalaDeAulaRepository;
import com.seucalendarioacademico.service.AtividadeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class SalaAdminPainelController {

    private final SalaDeAulaRepository salaRepository;
    private final AtividadeService atividadeService;

    public SalaAdminPainelController(SalaDeAulaRepository salaRepository, AtividadeService atividadeService) {
        this.salaRepository = salaRepository;
        this.atividadeService = atividadeService;
    }

    @PostMapping("/login")
    public ResponseEntity<AdminLoginResponse> login(@Valid @RequestBody AdminLoginRequest request) {
        SalaDeAula sala = salaRepository.findByCodigoConvite(request.codigoSala())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Sala não encontrada"));

        if (!sala.getSegredoLider().equals(request.senha())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        AdminLoginResponse response = new AdminLoginResponse(
                sala.getId(),
                sala.getNome(),
                sala.getSemestre(),
                true
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/salas/{salaId}/atividades")
    public ResponseEntity<List<AtividadeResponse>> listarAtividadesPorSala(@PathVariable Integer salaId) {
        List<AtividadeResponse> atividades = atividadeService.listarPorSala(salaId);
        return ResponseEntity.ok(atividades);
    }

    @GetMapping("/salas/{salaId}/atividades/pendentes")
    public ResponseEntity<List<AtividadeResponse>> listarAtividadesPendentes(@PathVariable Integer salaId) {
        List<AtividadeResponse> atividades = atividadeService.listarPendentes(salaId);
        return ResponseEntity.ok(atividades);
    }

    @PostMapping("/salas/{salaId}/atividades")
    public ResponseEntity<AtividadeResponse> criarAtividade(@PathVariable Integer salaId, @Valid @RequestBody AtividadeRequest request) {
        AtividadeResponse atividade = atividadeService.criar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(atividade);
    }

    @PutMapping("/salas/{salaId}/atividades/{atividadeId}")
    public ResponseEntity<AtividadeResponse> atualizarAtividade(
            @PathVariable Integer salaId,
            @PathVariable Long atividadeId,
            @Valid @RequestBody AtividadeRequest request) {
        AtividadeResponse atividade = atividadeService.atualizar(atividadeId, request);
        return ResponseEntity.ok(atividade);
    }

    @DeleteMapping("/salas/{salaId}/atividades/{atividadeId}")
    public ResponseEntity<Void> excluirAtividade(
            @PathVariable Integer salaId,
            @PathVariable Long atividadeId) {
        atividadeService.excluir(atividadeId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/salas/{salaId}/atividades/{atividadeId}/aprovar")
    public ResponseEntity<AtividadeResponse> aprovarAtividade(
            @PathVariable Integer salaId,
            @PathVariable Long atividadeId) {
        AtividadeResponse atividade = atividadeService.aprovar(atividadeId);
        return ResponseEntity.ok(atividade);
    }

    @PostMapping("/salas/{salaId}/atividades/{atividadeId}/rejeitar")
    public ResponseEntity<AtividadeResponse> rejeitarAtividade(
            @PathVariable Integer salaId,
            @PathVariable Long atividadeId) {
        AtividadeResponse atividade = atividadeService.rejeitar(atividadeId);
        return ResponseEntity.ok(atividade);
    }

    @GetMapping("/salas/{salaId}/provas")
    public ResponseEntity<List<AtividadeResponse>> listarProvas(@PathVariable Integer salaId) {
        List<AtividadeResponse> provas = atividadeService.listarProvas(salaId);
        return ResponseEntity.ok(provas);
    }
}
