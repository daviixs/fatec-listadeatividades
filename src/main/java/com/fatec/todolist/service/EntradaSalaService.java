package com.fatec.todolist.service;

import com.fatec.todolist.dto.EntradaSalaRequest;
import com.fatec.todolist.dto.EntradaSalaResponse;
import com.fatec.todolist.entity.Aluno;
import com.fatec.todolist.entity.EntradaSala;
import com.fatec.todolist.entity.SalaDeAula;
import com.fatec.todolist.entity.StatusEntrada;
import com.fatec.todolist.exception.RecursoNaoEncontradoException;
import com.fatec.todolist.repository.AlunoRepository;
import com.fatec.todolist.repository.EntradaSalaRepository;
import com.fatec.todolist.repository.SalaDeAulaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EntradaSalaService {

    private final EntradaSalaRepository entradaRepository;
    private final AlunoRepository alunoRepository;
    private final SalaDeAulaRepository salaRepository;

    public EntradaSalaResponse solicitarEntrada(EntradaSalaRequest request) {
        SalaDeAula sala = salaRepository.findByCodigoConvite(request.codigo())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Código de sala inválido"));

        Optional<Aluno> alunoOpt = alunoRepository.findBySalaIdAndRm(sala.getId(), request.rm());
        if (alunoOpt.isEmpty()) {
            throw new IllegalArgumentException("Aluno não cadastrado nesta sala");
        }

        Aluno aluno = alunoOpt.get();

        Optional<EntradaSala> entradaOpt = entradaRepository.findByAlunoIdAndSalaId(aluno.getId(), sala.getId());
        EntradaSala entrada;

        if (entradaOpt.isPresent()) {
            entrada = entradaOpt.get();
            entrada.setStatus(StatusEntrada.PENDENTE);
            entrada.setAtualizadoEm(LocalDateTime.now());
        } else {
            entrada = new EntradaSala();
            entrada.setSala(sala);
            entrada.setAluno(aluno);
            entrada.setStatus(StatusEntrada.PENDENTE);
            entrada.setCriadoEm(LocalDateTime.now());
            entrada.setAtualizadoEm(LocalDateTime.now());
        }

        EntradaSala salva = entradaRepository.save(entrada);
        return converterParaResponse(salva, aluno);
    }

    public List<EntradaSalaResponse> listarPendentes(Integer salaId) {
        return entradaRepository.findBySalaIdAndStatus(salaId, StatusEntrada.PENDENTE).stream()
                .map(e -> converterParaResponse(e, e.getAluno()))
                .toList();
    }

    @Transactional
    public void aprovar(Long entradaId, Integer salaId) {
        EntradaSala entrada = entradaRepository.findById(entradaId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Entrada não encontrada"));

        if (!entrada.getSala().getId().equals(salaId)) {
            throw new IllegalArgumentException("Entrada não pertence a esta sala");
        }

        entrada.setStatus(StatusEntrada.APROVADO);
        entrada.setAtualizadoEm(LocalDateTime.now());
        entradaRepository.save(entrada);
    }

    @Transactional
    public void rejeitar(Long entradaId, Integer salaId) {
        EntradaSala entrada = entradaRepository.findById(entradaId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Entrada não encontrada"));

        if (!entrada.getSala().getId().equals(salaId)) {
            throw new IllegalArgumentException("Entrada não pertence a esta sala");
        }

        entrada.setStatus(StatusEntrada.REJEITADO);
        entrada.setAtualizadoEm(LocalDateTime.now());
        entradaRepository.save(entrada);
    }

    public EntradaSalaResponse buscarPorId(Long entradaId, Integer salaId) {
        EntradaSala entrada = entradaRepository.findById(entradaId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Entrada não encontrada"));

        if (!entrada.getSala().getId().equals(salaId)) {
            throw new IllegalArgumentException("Entrada não pertence a esta sala");
        }

        return converterParaResponse(entrada, entrada.getAluno());
    }

    public Optional<EntradaSalaResponse> buscarPorAluno(Long alunoId, Integer salaId) {
        return entradaRepository.findByAlunoIdAndSalaId(alunoId, salaId)
                .map(e -> converterParaResponse(e, e.getAluno()));
    }

    private EntradaSalaResponse converterParaResponse(EntradaSala entrada, Aluno aluno) {
        return new EntradaSalaResponse(
                entrada.getId(),
                aluno.getId(),
                aluno.getNome(),
                aluno.getRm(),
                entrada.getStatus().name(),
                entrada.getCriadoEm(),
                entrada.getAtualizadoEm()
        );
    }
}
