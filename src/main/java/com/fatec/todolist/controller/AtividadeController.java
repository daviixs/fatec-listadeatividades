package com.fatec.todolist.controller;

import com.fatec.todolist.dto.AtividadeRequest;
import com.fatec.todolist.dto.AtividadeResponse;
import com.fatec.todolist.service.AtividadeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/atividades")
public class AtividadeController {

    private final AtividadeService atividadeService;

    public AtividadeController(AtividadeService atividadeService) {
        this.atividadeService = atividadeService;
    }

    @GetMapping
    public ResponseEntity<List<AtividadeResponse>> listarTodas() {
        List<AtividadeResponse> atividades = atividadeService.listarTodas();
        return ResponseEntity.ok(atividades);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AtividadeResponse> buscarPorId(@PathVariable Long id) {
        AtividadeResponse atividade = atividadeService.buscarPorId(id);
        return ResponseEntity.ok(atividade);
    }

    @GetMapping("/expirando")
    public ResponseEntity<List<AtividadeResponse>> listarExpirando(@RequestParam int horas) {
        if (horas != 24 && horas != 48 && horas != 72) {
            return ResponseEntity.badRequest().build();
        }
        List<AtividadeResponse> atividades = atividadeService.listarExpirando(horas);
        return ResponseEntity.ok(atividades);
    }

    @PostMapping
    public ResponseEntity<AtividadeResponse> criar(@Valid @RequestBody AtividadeRequest request) {
        AtividadeResponse atividade = atividadeService.criar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(atividade);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AtividadeResponse> atualizar(@PathVariable Long id,
                                                       @Valid @RequestBody AtividadeRequest request) {
        AtividadeResponse atividade = atividadeService.atualizar(id, request);
        return ResponseEntity.ok(atividade);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        atividadeService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
