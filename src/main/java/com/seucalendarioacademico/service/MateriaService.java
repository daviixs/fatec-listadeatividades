package com.seucalendarioacademico.service;

import com.seucalendarioacademico.dto.MateriaRequest;
import com.seucalendarioacademico.entity.Materia;
import com.seucalendarioacademico.entity.SalaDeAula;
import com.seucalendarioacademico.exception.RecursoNaoEncontradoException;
import com.seucalendarioacademico.repository.MateriaRepository;
import com.seucalendarioacademico.repository.SalaDeAulaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MateriaService {

    private final MateriaRepository materiaRepository;
    private final SalaDeAulaRepository salaRepository;
    private final CacheInvalidationService cacheInvalidationService;

    public MateriaService(MateriaRepository materiaRepository,
                          SalaDeAulaRepository salaRepository,
                          CacheInvalidationService cacheInvalidationService) {
        this.materiaRepository = materiaRepository;
        this.salaRepository = salaRepository;
        this.cacheInvalidationService = cacheInvalidationService;
    }

    @Transactional(readOnly = true)
    public List<Materia> listarTodas() {
        return materiaRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Materia buscarPorId(Long id) {
        return materiaRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Matéria não encontrada com id: " + id));
    }

    @Transactional(readOnly = true)
    public List<Materia> listarPorSala(Integer salaId) {
        return materiaRepository.findBySalaIdOrderByNomeAsc(salaId);
    }

    @Transactional
    public Materia criarMateria(MateriaRequest request) {
        SalaDeAula sala = salaRepository.findById(request.salaId().intValue())
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Sala não encontrada com id: " + request.salaId()));

        Materia materia = new Materia();
        materia.setNome(request.nome());
        materia.setProfessor(request.professor());
        materia.setSala(sala);

        Materia salva = materiaRepository.save(materia);
        cacheInvalidationService.evictSalaRelacionada(sala.getId());
        return salva;
    }

    @Transactional
    public Materia atualizarMateria(Long id, MateriaRequest request) {
        Materia materia = materiaRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Matéria não encontrada com id: " + id));

        SalaDeAula sala = salaRepository.findById(request.salaId().intValue())
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Sala não encontrada com id: " + request.salaId()));

        Integer salaAnteriorId = materia.getSala().getId();
        materia.setNome(request.nome());
        materia.setProfessor(request.professor());
        materia.setSala(sala);

        Materia atualizada = materiaRepository.save(materia);
        cacheInvalidationService.evictSalaRelacionada(salaAnteriorId);
        cacheInvalidationService.evictSalaRelacionada(sala.getId());
        return atualizada;
    }

    @Transactional
    public void deletarMateria(Long id) {
        Materia materia = materiaRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Matéria não encontrada com id: " + id));

        Integer salaId = materia.getSala().getId();
        materiaRepository.delete(materia);
        cacheInvalidationService.evictSalaRelacionada(salaId);
    }
}
