package com.fatec.todolist.service;

import com.fatec.todolist.dto.AlunoRequest;
import com.fatec.todolist.dto.AlunoResponse;
import com.fatec.todolist.entity.Aluno;
import com.fatec.todolist.entity.SalaDeAula;
import com.fatec.todolist.exception.RecursoNaoEncontradoException;
import com.fatec.todolist.repository.AlunoRepository;
import com.fatec.todolist.repository.SalaDeAulaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AlunoService {

    private final AlunoRepository alunoRepository;
    private final SalaDeAulaRepository salaRepository;

    public AlunoResponse cadastrar(Integer salaId, AlunoRequest request) {
        SalaDeAula sala = salaRepository.findById(salaId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Sala não encontrada"));

        if (alunoRepository.existsBySalaIdAndRm(salaId, request.rm())) {
            throw new IllegalArgumentException("Aluno com RM " + request.rm() + " já cadastrado nesta sala");
        }

        Aluno aluno = new Aluno();
        aluno.setRm(request.rm());
        aluno.setNome(request.nome());
        aluno.setSala(sala);

        Aluno salvo = alunoRepository.save(aluno);
        return converterParaResponse(salvo);
    }

    public List<AlunoResponse> listarPorSala(Integer salaId) {
        return alunoRepository.findBySalaId(salaId).stream()
                .map(this::converterParaResponse)
                .toList();
    }

    public long contarPorSala(Integer salaId) {
        return alunoRepository.countBySalaId(salaId);
    }

    private AlunoResponse converterParaResponse(Aluno aluno) {
        return new AlunoResponse(
                aluno.getId(),
                aluno.getRm(),
                aluno.getNome(),
                aluno.getSala().getNome()
        );
    }
}
