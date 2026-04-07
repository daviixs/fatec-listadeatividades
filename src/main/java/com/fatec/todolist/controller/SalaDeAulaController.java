package com.fatec.todolist.controller;

import com.fatec.todolist.dto.CursoResponse;
import com.fatec.todolist.dto.MateriaResponse;
import com.fatec.todolist.dto.SalaDeAulaRequest;
import com.fatec.todolist.dto.SalaCalendarioResponse;
import com.fatec.todolist.dto.SalaDeAulaResponse;
import com.fatec.todolist.dto.SemestreResponse;
import com.fatec.todolist.entity.SalaDeAula;
import com.fatec.todolist.service.SalaConsultaService;
import com.fatec.todolist.service.SalaDeAulaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/salas")
public class SalaDeAulaController {

    private final SalaDeAulaService salaService;
    private final SalaConsultaService salaConsultaService;

    public SalaDeAulaController(
            SalaDeAulaService salaService,
            SalaConsultaService salaConsultaService
    ) {
        this.salaService = salaService;
        this.salaConsultaService = salaConsultaService;
    }

    @GetMapping
    public ResponseEntity<List<SalaDeAulaResponse>> listarTodas() {
        return ResponseEntity.ok(salaConsultaService.listarTodas());
    }

    @GetMapping("/cursos")
    public ResponseEntity<List<CursoResponse>> listarCursosComSemestres() {
        List<SalaDeAulaResponse> salas = salaConsultaService.listarTodas();

        Map<String, CursoInfo> cursosMap = new HashMap<>();

        for (SalaDeAulaResponse sala : salas) {
            String cursoNome = extrairCursoNome(sala.nome());
            String nomeCompleto = obterNomeCompletoCurso(cursoNome);
            String semestreNumero = extrairSemestreNumero(sala.nome());

            CursoInfo cursoInfo = cursosMap.computeIfAbsent(cursoNome,
                k -> new CursoInfo(cursoNome, nomeCompleto, new ArrayList<>()));

            cursoInfo.semestres.add(new SemestreResponse(
                sala.id(),
                sala.nome(),
                semestreNumero
            ));

            Collections.sort(cursoInfo.semestres, 
                Comparator.comparingInt(s -> {
                    String semestre = s.semestre().replace("°", "");
                    return semestre.isEmpty() ? 0 : Integer.parseInt(semestre);
                }));
        }

        List<CursoResponse> cursos = cursosMap.values().stream()
                .map(info -> new CursoResponse(
                        info.nome,
                        info.nomeCompleto,
                        info.semestres
                ))
                .sorted(Comparator.comparing(CursoResponse::nome))
                .toList();

        return ResponseEntity.ok(cursos);
    }

    @GetMapping("/curso/{cursoNome}")
    public ResponseEntity<CursoResponse> buscarCursoPorNome(@PathVariable String cursoNome) {
        List<SalaDeAulaResponse> salas = salaConsultaService.listarTodas().stream()
                .filter(sala -> sala.nome().toUpperCase().startsWith(cursoNome.toUpperCase()))
                .toList();

        if (salas.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        String nomeCompleto = obterNomeCompletoCurso(cursoNome);

        List<SemestreResponse> semestres = salas.stream()
                .map(sala -> new SemestreResponse(
                        sala.id(),
                        sala.nome(),
                        extrairSemestreNumero(sala.nome())
                ))
                .sorted(Comparator.comparingInt(s -> {
                    String semestre = s.semestre().replace("°", "");
                    return semestre.isEmpty() ? 0 : Integer.parseInt(semestre);
                }))
                .toList();

        return ResponseEntity.ok(new CursoResponse(cursoNome.toUpperCase(), nomeCompleto, semestres));
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

    @GetMapping("/{salaId}/materias")
    public ResponseEntity<List<MateriaResponse>> listarMateriasPorSala(@PathVariable Integer salaId) {
        return ResponseEntity.ok(salaConsultaService.listarMateriasPorSala(salaId));
    }

    @GetMapping("/{salaId}/calendario")
    public ResponseEntity<SalaCalendarioResponse> buscarCalendarioPorSala(@PathVariable Integer salaId) {
        return ResponseEntity.ok(salaConsultaService.buscarCalendarioPorSala(salaId));
    }

    private String extrairCursoNome(String nomeSala) {
        if (nomeSala == null) return "";
        
        String[] partes = nomeSala.split("\\s+");
        if (partes.length >= 2) {
            return partes[0].toUpperCase();
        }
        return nomeSala.toUpperCase();
    }

    private String extrairSemestreNumero(String nomeSala) {
        if (nomeSala == null) return "";
        
        String[] partes = nomeSala.split("\\s+");
        if (partes.length >= 2) {
            String numero = partes[1].replace("°", "").replace(".", "");
            return numero + "°";
        }
        return "";
    }

    private String obterNomeCompletoCurso(String cursoNome) {
        return switch (cursoNome.toUpperCase()) {
            case "ADS" -> "Análise e Desenvolvimento de Sistemas";
            case "DSM" -> "Desenvolvimento de Software Multiplataforma";
            case "GPI" -> "Gestão da Produção Industrial";
            case "GRH" -> "Gestão de Recursos Humanos";
            default -> cursoNome;
        };
    }

    private static class CursoInfo {
        String nome;
        String nomeCompleto;
        List<SemestreResponse> semestres;

        CursoInfo(String nome, String nomeCompleto, List<SemestreResponse> semestres) {
            this.nome = nome;
            this.nomeCompleto = nomeCompleto;
            this.semestres = semestres;
        }
    }
}
