package com.fatec.todolist.controller;

import com.fatec.todolist.dto.AtividadeRequest;
import com.fatec.todolist.dto.AtividadeResponse;
import com.fatec.todolist.dto.MateriaRequest;
import com.fatec.todolist.dto.MateriaResponse;
import com.fatec.todolist.entity.Materia;
import com.fatec.todolist.service.AtividadeService;
import com.fatec.todolist.service.MateriaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/materias")
public class MateriaAdminController {

    private final MateriaService materiaService;
    private final AtividadeService atividadeService;

    public MateriaAdminController(MateriaService materiaService, AtividadeService atividadeService) {
        this.materiaService = materiaService;
        this.atividadeService = atividadeService;
    }

    @PutMapping("/{materiaId}")
    public ResponseEntity<MateriaResponse> atualizarMateria(@PathVariable Long materiaId,
                                                            @Valid @RequestBody MateriaRequest request) {
        Materia materia = materiaService.atualizarMateria(materiaId, request);
        return ResponseEntity.ok(toMateriaResponse(materia));
    }

    @DeleteMapping("/{materiaId}")
    public ResponseEntity<Void> deletarMateria(@PathVariable Long materiaId) {
        materiaService.deletarMateria(materiaId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{materiaId}/atividades")
    public ResponseEntity<AtividadeResponse> criarAtividade(@PathVariable Long materiaId,
                                                            @Valid @RequestBody AtividadeRequest request) {
        AtividadeRequest requestComMateria = new AtividadeRequest(
                null,
                request.titulo(),
                request.descricao(),
                request.tipoEntrega(),
                request.linkEntrega(),
                request.regras(),
                request.prazo(),
                materiaId,
                request.tipo()
        );
        AtividadeResponse atividade = atividadeService.criar(requestComMateria);
        return ResponseEntity.status(HttpStatus.CREATED).body(atividade);
    }

    private MateriaResponse toMateriaResponse(Materia materia) {
        return new MateriaResponse(
                materia.getId(),
                materia.getNome(),
                materia.getProfessor(),
                materia.getSala().getNome()
        );
    }
}

