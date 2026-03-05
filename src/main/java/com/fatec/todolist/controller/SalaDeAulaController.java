package com.fatec.todolist.controller;

import com.fatec.todolist.dto.SalaDeAulaRequest;
import com.fatec.todolist.dto.SalaDeAulaResponse;
import com.fatec.todolist.entity.SalaDeAula;
import com.fatec.todolist.service.SalaDeAulaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/salas")
public class SalaDeAulaController {

    private final SalaDeAulaService salaService;

    public SalaDeAulaController(SalaDeAulaService salaService) {
        this.salaService = salaService;
    }

    @GetMapping
    public ResponseEntity<List<SalaDeAulaResponse>> listarTodas() {
        List<SalaDeAulaResponse> salas = salaService.listarTodas()
                .stream()
                .map(sala -> new SalaDeAulaResponse(
                        sala.getId(),
                        sala.getNome(),
                        sala.getSemestre(),
                        sala.getCodigoConvite()
                ))
                .toList();
        return ResponseEntity.ok(salas);
    }

    @PostMapping
    public ResponseEntity<SalaDeAulaResponse> criarSala(@Valid @RequestBody SalaDeAulaRequest request) {
        SalaDeAula sala = salaService.criarSala(request);
        SalaDeAulaResponse response = new SalaDeAulaResponse(
                sala.getId(),
                sala.getNome(),
                sala.getSemestre(),
                sala.getCodigoConvite()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/acessar")
    public ResponseEntity<SalaDeAulaResponse> acessarPorCodigo(@RequestBody String codigoConvite) {
        SalaDeAula sala = salaService.acessarPorCodigo(codigoConvite);
        SalaDeAulaResponse response = new SalaDeAulaResponse(
                sala.getId(),
                sala.getNome(),
                sala.getSemestre(),
                sala.getCodigoConvite()
        );
        return ResponseEntity.ok(response);
    }
}
