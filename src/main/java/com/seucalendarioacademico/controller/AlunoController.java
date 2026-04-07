package com.seucalendarioacademico.controller;

import com.seucalendarioacademico.dto.AlunoRequest;
import com.seucalendarioacademico.dto.AlunoResponse;
import com.seucalendarioacademico.service.AlunoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/salas/{salaId}/alunos")
public class AlunoController {

    private final AlunoService alunoService;

    public AlunoController(AlunoService alunoService) {
        this.alunoService = alunoService;
    }

    @PostMapping
    public ResponseEntity<AlunoResponse> cadastrar(@PathVariable Integer salaId,
                                                        @Valid @RequestBody AlunoRequest request) {
        AlunoResponse aluno = alunoService.cadastrar(salaId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(aluno);
    }

    @GetMapping
    public ResponseEntity<List<AlunoResponse>> listarPorSala(@PathVariable Integer salaId) {
        List<AlunoResponse> alunos = alunoService.listarPorSala(salaId);
        return ResponseEntity.ok(alunos);
    }
}
