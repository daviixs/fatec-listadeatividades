package com.fatec.todolist.controller;

import com.fatec.todolist.dto.EnviarBoasVindasRequest;
import com.fatec.todolist.dto.LembretePreferenciasRequest;
import com.fatec.todolist.dto.LembretePreferenciasResponse;
import com.fatec.todolist.service.LembretePreferenciaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/lembretes")
@Tag(name = "Lembretes", description = "API para gerenciamento de assinaturas de email e envio de lembretes")
public class LembretePreferenciaController {

    private final LembretePreferenciaService preferenciaService;

    public LembretePreferenciaController(LembretePreferenciaService preferenciaService) {
        this.preferenciaService = preferenciaService;
    }

    @PostMapping("/assinantes")
    @Operation(summary = "Cadastrar ou atualizar assinante", description = "Cria um novo assinante ou atualiza as salas de um assinante existente")
    public ResponseEntity<LembretePreferenciasResponse> salvar(@Valid @RequestBody LembretePreferenciasRequest request) {
        LembretePreferenciasResponse response = preferenciaService.salvar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/assinantes/{email}")
    @Operation(summary = "Buscar assinante por email", description = "Retorna as preferências de salas de um assinante")
    public ResponseEntity<LembretePreferenciasResponse> buscar(
            @Parameter(description = "Email do assinante")
            @PathVariable String email) {
        return ResponseEntity.ok(preferenciaService.buscarPorEmail(email));
    }

    @DeleteMapping("/assinantes/{email}")
    @Operation(summary = "Desativar assinante", description = "Desativa um assinante, cancelando o recebimento de lembretes")
    public ResponseEntity<Void> desativar(
            @Parameter(description = "Email do assinante")
            @PathVariable String email) {
        preferenciaService.desativar(email);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/enviar-boas-vindas")
    @Operation(
            summary = "Enviar email de boas-vindas manualmente",
            description = "Endpoint de teste para enviar o email de boas-vindas para um email específico com as salas informadas"
    )
    public ResponseEntity<Void> enviarBoasVindas(@Valid @RequestBody EnviarBoasVindasRequest request) {
        preferenciaService.enviarEmailBoasVindas(request.email(), request.salaIds());
        return ResponseEntity.noContent().build();
    }
}
