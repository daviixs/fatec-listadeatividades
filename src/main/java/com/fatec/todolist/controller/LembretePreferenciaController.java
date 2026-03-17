package com.fatec.todolist.controller;

import com.fatec.todolist.dto.LembretePreferenciasRequest;
import com.fatec.todolist.dto.LembretePreferenciasResponse;
import com.fatec.todolist.service.LembretePreferenciaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/lembretes")
public class LembretePreferenciaController {

    private final LembretePreferenciaService preferenciaService;

    public LembretePreferenciaController(LembretePreferenciaService preferenciaService) {
        this.preferenciaService = preferenciaService;
    }

    @PostMapping("/assinantes")
    public ResponseEntity<LembretePreferenciasResponse> salvar(@Valid @RequestBody LembretePreferenciasRequest request) {
        LembretePreferenciasResponse response = preferenciaService.salvar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/assinantes/{email}")
    public ResponseEntity<LembretePreferenciasResponse> buscar(@PathVariable String email) {
        return ResponseEntity.ok(preferenciaService.buscarPorEmail(email));
    }

    @DeleteMapping("/assinantes/{email}")
    public ResponseEntity<Void> desativar(@PathVariable String email) {
        preferenciaService.desativar(email);
        return ResponseEntity.noContent().build();
    }
}
