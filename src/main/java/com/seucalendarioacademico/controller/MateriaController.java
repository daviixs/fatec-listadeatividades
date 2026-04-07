package com.seucalendarioacademico.controller;

import com.seucalendarioacademico.dto.AtividadeResponse;
import com.seucalendarioacademico.dto.MateriaRequest;
import com.seucalendarioacademico.dto.MateriaResponse;
import com.seucalendarioacademico.entity.Materia;
import com.seucalendarioacademico.service.AtividadeService;
import com.seucalendarioacademico.service.MateriaService;
import com.seucalendarioacademico.service.SalaConsultaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/materias")
public class MateriaController {

    private final MateriaService materiaService;
    private final AtividadeService atividadeService;
    private final SalaConsultaService salaConsultaService;

    public MateriaController(
            MateriaService materiaService,
            AtividadeService atividadeService,
            SalaConsultaService salaConsultaService
    ) {
        this.materiaService = materiaService;
        this.atividadeService = atividadeService;
        this.salaConsultaService = salaConsultaService;
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
        return ResponseEntity.ok(salaConsultaService.listarMateriasPorSala(salaId));
    }

    @GetMapping("/{materiaId}/atividades")
    public ResponseEntity<List<AtividadeResponse>> listarAtividadesPorMateria(@PathVariable Long materiaId) {
        List<AtividadeResponse> atividades = atividadeService.listarPorMateria(materiaId);
        return ResponseEntity.ok(atividades);
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
