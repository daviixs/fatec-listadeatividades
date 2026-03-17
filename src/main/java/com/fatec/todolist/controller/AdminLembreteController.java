package com.fatec.todolist.controller;

import com.fatec.todolist.service.LembreteDispatchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/lembretes")
public class AdminLembreteController {

    private final LembreteDispatchService dispatchService;

    public AdminLembreteController(LembreteDispatchService dispatchService) {
        this.dispatchService = dispatchService;
    }

    @PostMapping("/disparar-agora")
    public ResponseEntity<Void> dispararAgora() {
        dispatchService.processarJanelaAtual();
        return ResponseEntity.accepted().build();
    }
}
