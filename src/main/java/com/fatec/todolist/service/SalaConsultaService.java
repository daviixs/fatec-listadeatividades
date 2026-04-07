package com.fatec.todolist.service;

import com.fatec.todolist.config.CacheNames;
import com.fatec.todolist.dto.AtividadeCalendarioResponse;
import com.fatec.todolist.dto.MateriaResponse;
import com.fatec.todolist.dto.SalaCalendarioResponse;
import com.fatec.todolist.dto.SalaDeAulaResponse;
import com.fatec.todolist.entity.Atividade;
import com.fatec.todolist.entity.Materia;
import com.fatec.todolist.entity.SalaDeAula;
import com.fatec.todolist.repository.AtividadeRepository;
import com.fatec.todolist.repository.MateriaRepository;
import com.fatec.todolist.repository.SalaDeAulaRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SalaConsultaService {

    private final SalaDeAulaRepository salaRepository;
    private final MateriaRepository materiaRepository;
    private final AtividadeRepository atividadeRepository;

    public SalaConsultaService(
            SalaDeAulaRepository salaRepository,
            MateriaRepository materiaRepository,
            AtividadeRepository atividadeRepository
    ) {
        this.salaRepository = salaRepository;
        this.materiaRepository = materiaRepository;
        this.atividadeRepository = atividadeRepository;
    }

    @Cacheable(cacheNames = CacheNames.SALAS)
    @Transactional(readOnly = true)
    public List<SalaDeAulaResponse> listarTodas() {
        return salaRepository.findAllByOrderByNomeAsc()
                .stream()
                .map(this::toSalaResponse)
                .toList();
    }

    @Cacheable(cacheNames = CacheNames.MATERIAS_POR_SALA, key = "#salaId")
    @Transactional(readOnly = true)
    public List<MateriaResponse> listarMateriasPorSala(Integer salaId) {
        return materiaRepository.findBySalaIdOrderByNomeAsc(salaId)
                .stream()
                .map(this::toMateriaResponse)
                .toList();
    }

    @Cacheable(cacheNames = CacheNames.CALENDARIO_SALA, key = "#salaId")
    @Transactional(readOnly = true)
    public SalaCalendarioResponse buscarCalendarioPorSala(Integer salaId) {
        SalaDeAula sala = salaRepository.findById(salaId)
                .orElseThrow(() -> new com.fatec.todolist.exception.RecursoNaoEncontradoException("Sala nao encontrada"));

        List<MateriaResponse> materias = listarMateriasPorSala(salaId);
        List<AtividadeCalendarioResponse> atividades = atividadeRepository.findDetalhadasBySalaId(salaId)
                .stream()
                .map(this::toAtividadeCalendarioResponse)
                .toList();

        return new SalaCalendarioResponse(
                toSalaResponse(sala),
                materias,
                atividades
        );
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

    private AtividadeCalendarioResponse toAtividadeCalendarioResponse(Atividade atividade) {
        return new AtividadeCalendarioResponse(
                atividade.getId(),
                atividade.getTitulo(),
                atividade.getDescricao(),
                atividade.getTipoEntrega(),
                atividade.getLinkEntrega(),
                atividade.getRegras(),
                atividade.getPrazo(),
                atividade.getStatus(),
                atividade.getMateria().getId(),
                atividade.getMateria().getNome(),
                atividade.getTipo(),
                atividade.getStatusAprovacao(),
                atividade.getCriadoPorAlunoId()
        );
    }
}
