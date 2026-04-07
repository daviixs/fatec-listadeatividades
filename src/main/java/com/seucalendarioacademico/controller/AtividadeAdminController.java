package com.seucalendarioacademico.controller;

import com.seucalendarioacademico.dto.AtividadeRequest;
import com.seucalendarioacademico.dto.AtividadeResponse;
import com.seucalendarioacademico.service.AtividadeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/atividades")
public class AtividadeAdminController {

    private final AtividadeService atividadeService;

    public AtividadeAdminController(AtividadeService atividadeService) {
        this.atividadeService = atividadeService;
    }

    @PutMapping("/{atividadeId}")
    public ResponseEntity<AtividadeResponse> atualizarAtividade(@PathVariable Long atividadeId,
                                                                @Valid @RequestBody AtividadeRequest request) {
        AtividadeResponse atividade = atividadeService.atualizar(atividadeId, request);
        return ResponseEntity.ok(atividade);
    }

    @DeleteMapping("/{atividadeId}")
    public ResponseEntity<Void> excluirAtividade(@PathVariable Long atividadeId) {
        atividadeService.excluir(atividadeId);
        return ResponseEntity.noContent().build();
    }
}

