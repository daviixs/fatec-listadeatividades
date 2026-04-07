package com.seucalendarioacademico.repository;

import com.seucalendarioacademico.entity.StatusVotacao;
import com.seucalendarioacademico.entity.VotacaoCancelamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VotacaoCancelamentoRepository extends JpaRepository<VotacaoCancelamento, Long> {
    Optional<VotacaoCancelamento> findByAtividadeIdAndStatus(Long atividadeId, StatusVotacao status);

    Optional<VotacaoCancelamento> findByAtividadeId(Long atividadeId);
}
