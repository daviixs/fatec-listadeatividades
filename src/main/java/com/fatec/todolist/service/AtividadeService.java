package com.fatec.todolist.service;

import com.fatec.todolist.dto.AtividadeRequest;
import com.fatec.todolist.dto.AtividadeResponse;
import com.fatec.todolist.entity.Atividade;
import com.fatec.todolist.entity.Materia;
import com.fatec.todolist.exception.RecursoNaoEncontradoException;
import com.fatec.todolist.repository.AtividadeRepository;
import com.fatec.todolist.repository.MateriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AtividadeService {
    
    private final AtividadeRepository repository;
    private final MateriaRepository materiaRepository;
    
    public AtividadeResponse criar(AtividadeRequest request) {
        Materia materia = materiaRepository.findById(request.materiaId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Matéria não encontrada"));
        
        Atividade atividade = new Atividade();
        atividade.setTitulo(request.titulo());
        atividade.setDescricao(request.descricao());
        atividade.setTipoEntrega(request.tipoEntrega());
        atividade.setLinkEntrega(request.linkEntrega());
        atividade.setRegras(request.regras());
        atividade.setPrazo(request.prazo());
        atividade.setMateria(materia);
        
        Atividade salva = repository.save(atividade);
        return converterParaResponse(salva);
    }
    
    public AtividadeResponse buscarPorId(Long id) {
        Atividade atividade = repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Atividade não encontrada"));
        return converterParaResponse(atividade);
    }
    
    public List<AtividadeResponse> listarTodas() {
        return repository.findAll().stream()
                .map(this::converterParaResponse)
                .collect(Collectors.toList());
    }

    public List<AtividadeResponse> listarExpirando(int horas) {
        LocalDate hoje = LocalDate.now();
        LocalDate limite = hoje.plusDays(horas / 24);
        return repository.findByPrazoBetween(hoje, limite).stream()
                .map(this::converterParaResponse)
                .collect(Collectors.toList());
    }
    
    public AtividadeResponse atualizar(Long id, AtividadeRequest request) {
        Atividade atividade = repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Atividade não encontrada"));
        
        Materia materia = materiaRepository.findById(request.materiaId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Matéria não encontrada"));
        
        atividade.setTitulo(request.titulo());
        atividade.setDescricao(request.descricao());
        atividade.setTipoEntrega(request.tipoEntrega());
        atividade.setLinkEntrega(request.linkEntrega());
        atividade.setRegras(request.regras());
        atividade.setPrazo(request.prazo());
        atividade.setMateria(materia);
        
        Atividade atualizada = repository.save(atividade);
        return converterParaResponse(atualizada);
    }
    
    public void excluir(Long id) {
        if (!repository.existsById(id)) {
            throw new RecursoNaoEncontradoException("Atividade não encontrada");
        }
        repository.deleteById(id);
    }
    
    private AtividadeResponse converterParaResponse(Atividade atividade) {
        return new AtividadeResponse(
                atividade.getId(),
                atividade.getTitulo(),
                atividade.getDescricao(),
                atividade.getTipoEntrega(),
                atividade.getLinkEntrega(),
                atividade.getRegras(),
                atividade.getPrazo(),
                atividade.getMateria().getNome()
        );
    }
}