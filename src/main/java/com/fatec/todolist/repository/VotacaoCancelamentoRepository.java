package com.fatec.todolist.repository;

import com.fatec.todolist.entity.StatusVotacao;
import com.fatec.todolist.entity.VotacaoCancelamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VotacaoCancelamentoRepository extends JpaRepository<VotacaoCancelamento, Long> {
    Optional<VotacaoCancelamento> findByAtividadeIdAndStatus(Long atividadeId, StatusVotacao status);

    Optional<VotacaoCancelamento> findByAtividadeId(Long atividadeId);
}
