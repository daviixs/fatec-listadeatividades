package com.fatec.todolist.service;

import com.fatec.todolist.dto.AtividadeAdminResponse;
import com.fatec.todolist.dto.EmailAssinanteResponse;
import com.fatec.todolist.dto.SalaAdminResponse;
import com.fatec.todolist.entity.*;
import com.fatec.todolist.exception.RecursoNaoEncontradoException;
import com.fatec.todolist.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MasterAdminService {

    private final LembreteAssinanteRepository assinanteRepository;
    private final LembreteAssinanteSalaRepository assinanteSalaRepository;
    private final AtividadeRepository atividadeRepository;
    private final VotacaoCancelamentoRepository votacaoRepository;
    private final VotoRepository votoRepository;
    private final SalaDeAulaRepository salaRepository;
    private final MateriaRepository materiaRepository;
    private final AlunoRepository alunoRepository;
    private final EntradaSalaRepository entradaSalaRepository;

    public List<EmailAssinanteResponse> listarEmails() {
        return assinanteRepository.findAll().stream()
                .map(this::converterParaEmailResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void excluirEmail(Long id) {
        if (!assinanteRepository.existsById(id)) {
            throw new RecursoNaoEncontradoException("Email não encontrado");
        }
        assinanteSalaRepository.deleteByAssinanteId(id);
        assinanteRepository.deleteById(id);
    }

    public List<AtividadeAdminResponse> listarAtividades() {
        return atividadeRepository.findAll().stream()
                .map(this::converterParaAtividadeResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void excluirAtividade(Long id) {
        Atividade atividade = atividadeRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Atividade não encontrada"));

        VotacaoCancelamento votacao = votacaoRepository.findByAtividadeId(id).orElse(null);
        if (votacao != null) {
            votoRepository.deleteByVotacaoId(votacao.getId());
            votacaoRepository.deleteById(votacao.getId());
        }

        atividadeRepository.deleteById(id);
    }

    public List<SalaAdminResponse> listarSalas() {
        return salaRepository.findAll().stream()
                .map(this::converterParaSalaResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void excluirSala(Integer id) {
        if (!salaRepository.existsById(id)) {
            throw new RecursoNaoEncontradoException("Sala não encontrada");
        }

        List<Materia> materias = materiaRepository.findBySalaId(id);
        for (Materia materia : materias) {
            List<Atividade> atividades = atividadeRepository.findByMateriaId(materia.getId());
            for (Atividade atividade : atividades) {
                VotacaoCancelamento votacao = votacaoRepository.findByAtividadeId(atividade.getId()).orElse(null);
                if (votacao != null) {
                    votoRepository.deleteByVotacaoId(votacao.getId());
                    votacaoRepository.deleteById(votacao.getId());
                }
            }
            atividadeRepository.deleteAll(atividades);
        }
        materiaRepository.deleteAll(materias);

        List<Aluno> alunos = alunoRepository.findBySalaId(id);
        for (Aluno aluno : alunos) {
            List<EntradaSala> entradas = entradaSalaRepository.findBySalaIdAndStatus(id, null);
            entradaSalaRepository.deleteAll(entradas);
        }
        alunoRepository.deleteAll(alunos);

        salaRepository.deleteById(id);
    }

    private EmailAssinanteResponse converterParaEmailResponse(LembreteAssinante assinante) {
        return new EmailAssinanteResponse(
                assinante.getId(),
                assinante.getEmail(),
                assinante.getAtivo(),
                assinante.getDataCadastro(),
                assinante.getUltimoEnvio()
        );
    }

    private AtividadeAdminResponse converterParaAtividadeResponse(Atividade atividade) {
        Long salaId = atividade.getMateria() != null && atividade.getMateria().getSala() != null
                ? atividade.getMateria().getSala().getId().longValue()
                : null;

        return new AtividadeAdminResponse(
                atividade.getId(),
                atividade.getTitulo(),
                atividade.getDescricao(),
                atividade.getTipoEntrega() != null ? atividade.getTipoEntrega().name() : null,
                atividade.getLinkEntrega(),
                atividade.getPrazo(),
                atividade.getStatus() != null ? atividade.getStatus().name() : null,
                atividade.getMateria() != null ? atividade.getMateria().getNome() : null,
                atividade.getTipo() != null ? atividade.getTipo().name() : null,
                atividade.getStatusAprovacao() != null ? atividade.getStatusAprovacao().name() : null,
                atividade.getMateria() != null ? atividade.getMateria().getId() : null,
                salaId
        );
    }

    private SalaAdminResponse converterParaSalaResponse(SalaDeAula sala) {
        return new SalaAdminResponse(
                sala.getId(),
                sala.getNome(),
                sala.getSemestre(),
                sala.getCodigoConvite()
        );
    }
}
