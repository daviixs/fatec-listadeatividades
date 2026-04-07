package com.seucalendarioacademico.controller;

import com.seucalendarioacademico.dto.MateriaRequest;
import com.seucalendarioacademico.dto.MateriaResponse;
import com.seucalendarioacademico.dto.SalaDeAulaRequest;
import com.seucalendarioacademico.dto.SalaDeAulaResponse;
import com.seucalendarioacademico.entity.Materia;
import com.seucalendarioacademico.entity.SalaDeAula;
import com.seucalendarioacademico.service.MateriaService;
import com.seucalendarioacademico.service.SalaDeAulaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/salas")
public class SalaAdminController {

    private final SalaDeAulaService salaService;
    private final MateriaService materiaService;

    public SalaAdminController(SalaDeAulaService salaService, MateriaService materiaService) {
        this.salaService = salaService;
        this.materiaService = materiaService;
    }

    @PostMapping
    public ResponseEntity<SalaDeAulaResponse> criarSala(@Valid @RequestBody SalaDeAulaRequest request) {
        SalaDeAula sala = salaService.criarSala(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(toSalaResponse(sala));
    }

    @PutMapping("/{salaId}")
    public ResponseEntity<SalaDeAulaResponse> atualizarSala(@PathVariable Integer salaId,
                                                            @Valid @RequestBody SalaDeAulaRequest request) {
        SalaDeAula sala = salaService.atualizarSala(salaId, request);
        return ResponseEntity.ok(toSalaResponse(sala));
    }

    @DeleteMapping("/{salaId}")
    public ResponseEntity<Void> deletarSala(@PathVariable Integer salaId) {
        salaService.deletarSala(salaId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{salaId}/materias")
    public ResponseEntity<MateriaResponse> criarMateriaNaSala(@PathVariable Integer salaId,
                                                              @Valid @RequestBody MateriaRequest request) {
        MateriaRequest requestComSala = new MateriaRequest(
                request.nome(),
                request.professor(),
                salaId.longValue()
        );
        Materia materia = materiaService.criarMateria(requestComSala);
        return ResponseEntity.status(HttpStatus.CREATED).body(toMateriaResponse(materia));
    }

    private SalaDeAulaResponse toSalaResponse(SalaDeAula sala) {
        return new SalaDeAulaResponse(
                sala.getId(),
                sala.getNome(),
                sala.getSemestre(),
                sala.getCodigoConvite()
        );
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

