package com.seucalendarioacademico.service;

import com.seucalendarioacademico.dto.AtividadeRequest;
import com.seucalendarioacademico.dto.AtividadeResponse;
import com.seucalendarioacademico.entity.Atividade;
import com.seucalendarioacademico.entity.Materia;
import com.seucalendarioacademico.exception.RecursoNaoEncontradoException;
import com.seucalendarioacademico.repository.AtividadeRepository;
import com.seucalendarioacademico.repository.MateriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AtividadeService {
    
    private final AtividadeRepository repository;
    private final MateriaRepository materiaRepository;
    private final VotacaoService votacaoService;
    private final CacheInvalidationService cacheInvalidationService;
    
    @Transactional
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
        atividade.setTipo(request.tipo());
        
        Atividade salva = repository.save(atividade);
        
        if (salva.getStatus() == com.seucalendarioacademico.entity.StatusAtividade.ATIVA) {
            try {
                votacaoService.abrirVotacao(salva.getId());
            } catch (IllegalArgumentException e) {
                if (!e.getMessage().contains("Já existe votação aberta")) {
                    throw e;
                }
            }
        }

        cacheInvalidationService.evictSalaRelacionada(materia.getSala().getId());
        
        return converterParaResponse(salva);
    }
    
    @Transactional(readOnly = true)
    public AtividadeResponse buscarPorId(Long id) {
        Atividade atividade = repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Atividade não encontrada"));
        return converterParaResponse(atividade);
    }
    
    @Transactional(readOnly = true)
    public List<AtividadeResponse> listarTodas() {
        return repository.findAll().stream()
                .map(this::converterParaResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AtividadeResponse> listarPorMateria(Long materiaId) {
        return repository.findDetalhadasByMateriaId(materiaId).stream()
                .map(this::converterParaResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AtividadeResponse> listarExpirando(int horas) {
        LocalDate hoje = LocalDate.now();
        LocalDate limite = hoje.plusDays(horas / 24);
        return repository.findDetalhadasByPrazoBetween(hoje, limite).stream()
                .map(this::converterParaResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public AtividadeResponse atualizar(Long id, AtividadeRequest request) {
        Atividade atividade = repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Atividade não encontrada"));
        
        Materia materia = materiaRepository.findById(request.materiaId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Matéria não encontrada"));
        
        Integer salaAnteriorId = atividade.getMateria().getSala().getId();
        atividade.setTitulo(request.titulo());
        atividade.setDescricao(request.descricao());
        atividade.setTipoEntrega(request.tipoEntrega());
        atividade.setLinkEntrega(request.linkEntrega());
        atividade.setRegras(request.regras());
        atividade.setPrazo(request.prazo());
        atividade.setMateria(materia);
        atividade.setTipo(request.tipo());
        
        Atividade atualizada = repository.save(atividade);
        cacheInvalidationService.evictSalaRelacionada(salaAnteriorId);
        cacheInvalidationService.evictSalaRelacionada(materia.getSala().getId());
        return converterParaResponse(atualizada);
    }
    
    @Transactional
    public void excluir(Long id) {
        Atividade atividade = repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Atividade não encontrada"));
        Integer salaId = atividade.getMateria().getSala().getId();
        repository.delete(atividade);
        cacheInvalidationService.evictSalaRelacionada(salaId);
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
                atividade.getStatus(),
                atividade.getMateria().getNome(),
                atividade.getTipo(),
                atividade.getStatusAprovacao(),
                atividade.getCriadoPorAlunoId()
        );
    }

    @Transactional(readOnly = true)
    public List<AtividadeResponse> listarPorSala(Integer salaId) {
        return repository.findDetalhadasBySalaId(salaId).stream()
                .map(this::converterParaResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AtividadeResponse> listarPendentes(Integer salaId) {
        return repository.findDetalhadasBySalaIdAndStatusAprovacao(
                        salaId,
                        com.seucalendarioacademico.entity.StatusAprovacao.PENDENTE
                ).stream()
                .map(this::converterParaResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AtividadeResponse> listarProvas(Integer salaId) {
        return repository.findDetalhadasBySalaIdAndTipo(
                        salaId,
                        com.seucalendarioacademico.entity.TipoAtividade.PROVA
                ).stream()
                .map(this::converterParaResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public AtividadeResponse aprovar(Long atividadeId) {
        Atividade atividade = repository.findById(atividadeId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Atividade não encontrada"));
        Integer salaId = atividade.getMateria().getSala().getId();
        atividade.setStatusAprovacao(com.seucalendarioacademico.entity.StatusAprovacao.APROVADA);
        Atividade salva = repository.save(atividade);
        cacheInvalidationService.evictSalaRelacionada(salaId);
        return converterParaResponse(salva);
    }

    @Transactional
    public AtividadeResponse rejeitar(Long atividadeId) {
        Atividade atividade = repository.findById(atividadeId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Atividade não encontrada"));
        Integer salaId = atividade.getMateria().getSala().getId();
        atividade.setStatusAprovacao(com.seucalendarioacademico.entity.StatusAprovacao.REJEITADA);
        Atividade salva = repository.save(atividade);
        cacheInvalidationService.evictSalaRelacionada(salaId);
        return converterParaResponse(salva);
    }
}
