package com.seucalendarioacademico.service;

import com.seucalendarioacademico.dto.VotacaoCancelamentoResponse;
import com.seucalendarioacademico.dto.VotoRequest;
import com.seucalendarioacademico.dto.VotoResponse;
import com.seucalendarioacademico.entity.Aluno;
import com.seucalendarioacademico.entity.Atividade;
import com.seucalendarioacademico.entity.EntradaSala;
import com.seucalendarioacademico.entity.OpcaoVoto;
import com.seucalendarioacademico.entity.StatusAtividade;
import com.seucalendarioacademico.entity.StatusEntrada;
import com.seucalendarioacademico.entity.StatusVotacao;
import com.seucalendarioacademico.entity.VotacaoCancelamento;
import com.seucalendarioacademico.entity.Voto;
import com.seucalendarioacademico.exception.RecursoNaoEncontradoException;
import com.seucalendarioacademico.repository.AlunoRepository;
import com.seucalendarioacademico.repository.AtividadeRepository;
import com.seucalendarioacademico.repository.EntradaSalaRepository;
import com.seucalendarioacademico.repository.VotacaoCancelamentoRepository;
import com.seucalendarioacademico.repository.VotoRepository;
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
        return converterParaResponse(salva, null);
    }

    public Optional<VotacaoCancelamentoResponse> buscarVotacao(Long atividadeId, String ip) {
        return votacaoRepository.findByAtividadeId(atividadeId)
                .map(v -> converterParaResponse(v, ip));
    }

    @Transactional
    public VotoResponse registrarVoto(Long atividadeId, Long alunoId, VotoRequest request, String ip) {
        VotacaoCancelamento votacao = votacaoRepository.findByAtividadeIdAndStatus(atividadeId, StatusVotacao.ABERTA)
                .orElseThrow(() -> new IllegalArgumentException("Votação não está aberta"));

        if (ip == null || ip.isBlank()) {
            throw new IllegalArgumentException("IP do solicitante é obrigatório");
        }

        if (votoRepository.existsByVotacaoIdAndIp(votacao.getId(), ip.trim())) {
            throw new IllegalArgumentException("IP já votou nesta votação");
        }

        Aluno aluno = null;
        if (alunoId != null) {
            aluno = alunoRepository.findById(alunoId)
                    .orElseThrow(() -> new RecursoNaoEncontradoException("Aluno não encontrado"));

            Optional<EntradaSala> entradaOpt = entradaRepository.findByAlunoIdAndSalaId(alunoId, votacao.getAtividade().getMateria().getSala().getId());
            if (entradaOpt.isEmpty() || entradaOpt.get().getStatus() != StatusEntrada.APROVADO) {
                throw new IllegalArgumentException("Aluno não está aprovado nesta sala");
            }

            if (votoRepository.existsByVotacaoIdAndAlunoId(votacao.getId(), alunoId)) {
                throw new IllegalArgumentException("Aluno já votou nesta votação");
            }
        }

        Voto voto = new Voto();
        voto.setVotacao(votacao);
        voto.setAluno(aluno);
        voto.setIp(ip.trim());
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

    private VotacaoCancelamentoResponse converterParaResponse(VotacaoCancelamento votacao, String ip) {
        long votosSim = votoRepository.countByVotacaoIdAndOpcao(votacao.getId(), OpcaoVoto.SIM);
        long votosNao = votoRepository.countByVotacaoIdAndOpcao(votacao.getId(), OpcaoVoto.NAO);
        long totalAlunos = alunoRepository.countBySalaId(votacao.getAtividade().getMateria().getSala().getId());
        long meta = (long) Math.ceil(totalAlunos * 0.8);
        boolean jaVotou = ip != null && votoRepository.existsByVotacaoIdAndIp(votacao.getId(), ip.trim());

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
                votacao.getAtividade().getStatus() == StatusAtividade.CANCELADA,
                jaVotou
        );
    }

    private VotoResponse converterParaVotoResponse(Voto voto) {
        Long alunoId = voto.getAluno() != null ? voto.getAluno().getId() : null;
        String alunoNome = voto.getAluno() != null ? voto.getAluno().getNome() : null;
        return new VotoResponse(
                voto.getId(),
                alunoId,
                alunoNome,
                voto.getOpcao().name(),
                voto.getVotadoEm()
        );
    }
}
