package com.seucalendarioacademico.controller;

import com.seucalendarioacademico.dto.AprovarEntradaRequest;
import com.seucalendarioacademico.dto.EntradaSalaRequest;
import com.seucalendarioacademico.dto.EntradaSalaResponse;
import com.seucalendarioacademico.service.EntradaSalaService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/salas/{salaId}/entradas")
public class EntradaSalaController {

    private final EntradaSalaService entradaService;

    public EntradaSalaController(EntradaSalaService entradaService) {
        this.entradaService = entradaService;
    }

    @PostMapping
    public ResponseEntity<EntradaSalaResponse> solicitarEntrada(@PathVariable Integer salaId,
                                                                     @Valid @RequestBody EntradaSalaRequest request) {
        EntradaSalaResponse entrada = entradaService.solicitarEntrada(request);
        return ResponseEntity.ok(entrada);
    }

    @GetMapping
    public ResponseEntity<List<EntradaSalaResponse>> listarPendentes(@PathVariable Integer salaId) {
        List<EntradaSalaResponse> entradas = entradaService.listarPendentes(salaId);
        return ResponseEntity.ok(entradas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EntradaSalaResponse> buscarPorId(@PathVariable Integer salaId,
                                                             @PathVariable Long id) {
        EntradaSalaResponse entrada = entradaService.buscarPorId(id, salaId);
        return ResponseEntity.ok(entrada);
    }

    @PatchMapping("/{id}/aprovar")
    public ResponseEntity<Void> aprovar(@PathVariable Integer salaId,
                                               @PathVariable Long id,
                                               @Valid @RequestBody AprovarEntradaRequest request) {
        if (request.aprovado()) {
            entradaService.aprovar(id, salaId);
        } else {
            entradaService.rejeitar(id, salaId);
        }
        return ResponseEntity.noContent().build();
    }
}
