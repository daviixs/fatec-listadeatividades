package com.seucalendarioacademico.controller;

import com.seucalendarioacademico.dto.*;
import com.seucalendarioacademico.service.MasterAdminAuthService;
import com.seucalendarioacademico.service.MasterAdminService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/master-admin")
public class MasterAdminController {

    private final MasterAdminAuthService authService;
    private final MasterAdminService masterAdminService;

    public MasterAdminController(MasterAdminAuthService authService, MasterAdminService masterAdminService) {
        this.authService = authService;
        this.masterAdminService = masterAdminService;
    }

    @PostMapping("/login")
    public ResponseEntity<MasterAdminLoginResponse> login(@Valid @RequestBody MasterAdminLoginRequest request) {
        String token = authService.authenticate(request.username(), request.password());
        return ResponseEntity.ok(new MasterAdminLoginResponse(token, request.username(), 24L));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest httpRequest) {
        String authorizationHeader = httpRequest.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            authService.invalidateToken(token);
        }
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/emails")
    public ResponseEntity<List<EmailAssinanteResponse>> listarEmails() {
        List<EmailAssinanteResponse> emails = masterAdminService.listarEmails();
        return ResponseEntity.ok(emails);
    }

    @DeleteMapping("/emails/{id}")
    public ResponseEntity<Void> excluirEmail(@PathVariable Long id) {
        masterAdminService.excluirEmail(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/atividades")
    public ResponseEntity<List<AtividadeAdminResponse>> listarAtividades() {
        List<AtividadeAdminResponse> atividades = masterAdminService.listarAtividades();
        return ResponseEntity.ok(atividades);
    }

    @DeleteMapping("/atividades/{id}")
    public ResponseEntity<Void> excluirAtividade(@PathVariable Long id) {
        masterAdminService.excluirAtividade(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/salas")
    public ResponseEntity<List<SalaAdminResponse>> listarSalas() {
        List<SalaAdminResponse> salas = masterAdminService.listarSalas();
        return ResponseEntity.ok(salas);
    }

    @DeleteMapping("/salas/{id}")
    public ResponseEntity<Void> excluirSala(@PathVariable Integer id) {
        masterAdminService.excluirSala(id);
        return ResponseEntity.noContent().build();
    }
}
