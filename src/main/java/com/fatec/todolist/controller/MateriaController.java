package com.fatec.todolist.controller;

import com.fatec.todolist.dto.MateriaRequest;
import com.fatec.todolist.dto.MateriaResponse;
import com.fatec.todolist.entity.Materia;
import com.fatec.todolist.service.MateriaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/materias")
public class MateriaController {

    private final MateriaService materiaService;

    public MateriaController(MateriaService materiaService) {
        this.materiaService = materiaService;
    }

    @GetMapping
    public ResponseEntity<List<MateriaResponse>> listarTodas() {
        List<MateriaResponse> materias = materiaService.listarTodas()
                .stream()
                .map(this::toResponse)
                .toList();
        return ResponseEntity.ok(materias);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MateriaResponse> buscarPorId(@PathVariable Long id) {
        Materia materia = materiaService.buscarPorId(id);
        return ResponseEntity.ok(toResponse(materia));
    }

    @GetMapping("/sala/{salaId}")
    public ResponseEntity<List<MateriaResponse>> listarPorSala(@PathVariable Integer salaId) {
        List<MateriaResponse> materias = materiaService.listarPorSala(salaId)
                .stream()
                .map(this::toResponse)
                .toList();
        return ResponseEntity.ok(materias);
    }

    @PostMapping
    public ResponseEntity<MateriaResponse> criarMateria(@Valid @RequestBody MateriaRequest request) {
        Materia materia = materiaService.criarMateria(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(materia));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MateriaResponse> atualizarMateria(@PathVariable Long id,
                                                            @Valid @RequestBody MateriaRequest request) {
        Materia materia = materiaService.atualizarMateria(id, request);
        return ResponseEntity.ok(toResponse(materia));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarMateria(@PathVariable Long id) {
        materiaService.deletarMateria(id);
        return ResponseEntity.noContent().build();
    }

    private MateriaResponse toResponse(Materia materia) {
        return new MateriaResponse(
                materia.getId(),
                materia.getNome(),
                materia.getProfessor(),
                materia.getSala().getNome()
        );
    }
}
