package com.fatec.todolist.service;

import com.fatec.todolist.dto.VotacaoCancelamentoResponse;
import com.fatec.todolist.dto.VotoRequest;
import com.fatec.todolist.dto.VotoResponse;
import com.fatec.todolist.entity.Aluno;
import com.fatec.todolist.entity.Atividade;
import com.fatec.todolist.entity.EntradaSala;
import com.fatec.todolist.entity.OpcaoVoto;
import com.fatec.todolist.entity.StatusAtividade;
import com.fatec.todolist.entity.StatusEntrada;
import com.fatec.todolist.entity.StatusVotacao;
import com.fatec.todolist.entity.VotacaoCancelamento;
import com.fatec.todolist.entity.Voto;
import com.fatec.todolist.exception.RecursoNaoEncontradoException;
import com.fatec.todolist.repository.AlunoRepository;
import com.fatec.todolist.repository.AtividadeRepository;
import com.fatec.todolist.repository.EntradaSalaRepository;
import com.fatec.todolist.repository.VotacaoCancelamentoRepository;
import com.fatec.todolist.repository.VotoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VotacaoService {

    private final VotacaoCancelamentoRepository votacaoRepository;
    private final VotoRepository votoRepository;
    private final AtividadeRepository atividadeRepository;
    private final AlunoRepository alunoRepository;
    private final EntradaSalaRepository entradaRepository;

    public VotacaoCancelamentoResponse abrirVotacao(Long atividadeId) {
        Atividade atividade = atividadeRepository.findById(atividadeId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Atividade não encontrada"));

        if (atividade.getStatus() != StatusAtividade.ATIVA) {
            throw new IllegalArgumentException("Atividade não está ativa");
        }

        if (votacaoRepository.findByAtividadeIdAndStatus(atividadeId, StatusVotacao.ABERTA).isPresent()) {
            throw new IllegalArgumentException("Já existe votação aberta para esta atividade");
        }

        VotacaoCancelamento votacao = new VotacaoCancelamento();
        votacao.setAtividade(atividade);
        votacao.setIniciadaEm(LocalDateTime.now());
        votacao.setEncerraEm(LocalDateTime.now().plusHours(12));
        votacao.setStatus(StatusVotacao.ABERTA);

        VotacaoCancelamento salva = votacaoRepository.save(votacao);
        return converterParaResponse(salva);
    }

    public Optional<VotacaoCancelamentoResponse> buscarVotacao(Long atividadeId) {
        return votacaoRepository.findByAtividadeId(atividadeId)
                .map(this::converterParaResponse);
    }

    @Transactional
    public VotoResponse registrarVoto(Long atividadeId, Long alunoId, VotoRequest request) {
        VotacaoCancelamento votacao = votacaoRepository.findByAtividadeIdAndStatus(atividadeId, StatusVotacao.ABERTA)
                .orElseThrow(() -> new IllegalArgumentException("Votação não está aberta"));

        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Aluno não encontrado"));

        Optional<EntradaSala> entradaOpt = entradaRepository.findByAlunoIdAndSalaId(alunoId, votacao.getAtividade().getMateria().getSala().getId());
        if (entradaOpt.isEmpty() || entradaOpt.get().getStatus() != StatusEntrada.APROVADO) {
            throw new IllegalArgumentException("Aluno não está aprovado nesta sala");
        }

        if (votoRepository.existsByVotacaoIdAndAlunoId(votacao.getId(), alunoId)) {
            throw new IllegalArgumentException("Aluno já votou nesta votação");
        }

        Voto voto = new Voto();
        voto.setVotacao(votacao);
        voto.setAluno(aluno);
        voto.setOpcao(request.opcao());
        voto.setVotadoEm(LocalDateTime.now());

        Voto votoSalvo = votoRepository.save(voto);

        if (request.opcao() == OpcaoVoto.SIM) {
            verificarCancelamento(votacao);
        }

        return converterParaVotoResponse(votoSalvo);
    }

    private void verificarCancelamento(VotacaoCancelamento votacao) {
        long votosSim = votoRepository.countByVotacaoIdAndOpcao(votacao.getId(), OpcaoVoto.SIM);
        long totalAlunos = alunoRepository.countBySalaId(votacao.getAtividade().getMateria().getSala().getId());
        long meta = (long) Math.ceil(totalAlunos * 0.8);

        if (votosSim >= meta) {
            Atividade atividade = votacao.getAtividade();
            atividade.setStatus(StatusAtividade.CANCELADA);
            atividadeRepository.save(atividade);

            votacao.setStatus(StatusVotacao.ENCERRADA);
            votacaoRepository.save(votacao);
        }
    }

    @Transactional
    public void encerrarVotacao(Long atividadeId) {
        VotacaoCancelamento votacao = votacaoRepository.findByAtividadeIdAndStatus(atividadeId, StatusVotacao.ABERTA)
                .orElseThrow(() -> new IllegalArgumentException("Votação não está aberta"));

        votacao.setStatus(StatusVotacao.ENCERRADA);
        votacaoRepository.save(votacao);
    }

    private VotacaoCancelamentoResponse converterParaResponse(VotacaoCancelamento votacao) {
        long votosSim = votoRepository.countByVotacaoIdAndOpcao(votacao.getId(), OpcaoVoto.SIM);
        long votosNao = votoRepository.countByVotacaoIdAndOpcao(votacao.getId(), OpcaoVoto.NAO);
        long totalAlunos = alunoRepository.countBySalaId(votacao.getAtividade().getMateria().getSala().getId());
        long meta = (long) Math.ceil(totalAlunos * 0.8);

        return new VotacaoCancelamentoResponse(
                votacao.getId(),
                votacao.getAtividade().getId(),
                votacao.getAtividade().getTitulo(),
                votacao.getAtividade().getStatus().name(),
                votacao.getIniciadaEm(),
                votacao.getEncerraEm(),
                votacao.getStatus().name(),
                votosSim,
                votosNao,
                totalAlunos,
                meta,
                votacao.getAtividade().getStatus() == StatusAtividade.CANCELADA
        );
    }

    private VotoResponse converterParaVotoResponse(Voto voto) {
        return new VotoResponse(
                voto.getId(),
                voto.getAluno().getId(),
                voto.getAluno().getNome(),
                voto.getOpcao().name(),
                voto.getVotadoEm()
        );
    }
}
