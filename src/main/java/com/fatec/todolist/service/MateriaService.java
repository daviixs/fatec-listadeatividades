package com.fatec.todolist.service;

import com.fatec.todolist.dto.MateriaRequst;
import com.fatec.todolist.entity.Materia;
import com.fatec.todolist.entity.SalaDeAula;
import com.fatec.todolist.exception.RecursoNaoEncontradoException;
import com.fatec.todolist.repository.MateriaRepository;
import com.fatec.todolist.repository.SalaDeAulaRespository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MateriaService {

    private final MateriaRepository materiaRepository;
    private final SalaDeAulaRespository salaRepository;

    public MateriaService(MateriaRepository materiaRepository,
                          SalaDeAulaRespository salaRepository) {
        this.materiaRepository = materiaRepository;
        this.salaRepository = salaRepository;
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
        return materiaRepository.findBySalaId(salaId);
    }

    @Transactional
    public Materia criarMateria(MateriaRequst request) {
        SalaDeAula sala = salaRepository.findById(request.salaId().intValue())
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Sala não encontrada com id: " + request.salaId()));

        Materia materia = new Materia();
        materia.setNome(request.nome());
        materia.setProfessor(request.professor());
        materia.setSala(sala);

        return materiaRepository.save(materia);
    }

    @Transactional
    public Materia atualizarMateria(Long id, MateriaRequst request) {
        Materia materia = materiaRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Matéria não encontrada com id: " + id));

        SalaDeAula sala = salaRepository.findById(request.salaId().intValue())
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Sala não encontrada com id: " + request.salaId()));

        materia.setNome(request.nome());
        materia.setProfessor(request.professor());
        materia.setSala(sala);

        return materiaRepository.save(materia);
    }

    @Transactional
    public void deletarMateria(Long id) {
        if (!materiaRepository.existsById(id)) {
            throw new RecursoNaoEncontradoException(
                    "Matéria não encontrada com id: " + id);
        }
        materiaRepository.deleteById(id);
    }
}
