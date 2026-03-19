package com.fatec.todolist.controller;

import com.fatec.todolist.service.LembreteDispatchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import java.util.List;

@RestController
@RequestMapping("/api/admin/lembretes")
public class AdminLembreteController {

    private final LembreteDispatchService dispatchService;

    public AdminLembreteController(LembreteDispatchService dispatchService) {
        this.dispatchService = dispatchService;
    }

    @PostMapping("/disparar-agora")
    @Operation(summary = "Disparar e-mails de atividades pendentes imediatamente",
            description = "Executa a janela atual de lembretes usando as assinaturas de sala ativas.")
    @ApiResponses({
            @ApiResponse(responseCode = "202", description = "Processamento iniciado"),
            @ApiResponse(responseCode = "500", description = "Falha ao processar envio")
    })
    public ResponseEntity<Void> dispararAgora() {
        dispatchService.processarJanelaAtual();
        return ResponseEntity.accepted().build();
    }

    @PostMapping("/disparar-para")
    @Operation(summary = "Enviar resumo para um email específico",
            description = "Dispara o resumo de atividades pendentes para o email informado. Opcionalmente filtra pelas salas indicadas.")
    public ResponseEntity<Void> dispararParaEmail(@RequestParam String email,
                                                  @RequestParam(required = false) List<Integer> salaIds) {
        dispatchService.enviarResumoDireto(email, salaIds);
        return ResponseEntity.accepted().build();
    }
}
