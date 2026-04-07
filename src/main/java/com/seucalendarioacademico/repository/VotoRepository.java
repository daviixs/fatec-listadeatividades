package com.seucalendarioacademico.repository;

import com.seucalendarioacademico.entity.OpcaoVoto;
import com.seucalendarioacademico.entity.Voto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VotoRepository extends JpaRepository<Voto, Long> {
    boolean existsByVotacaoIdAndAlunoId(Long votacaoId, Long alunoId);

    boolean existsByVotacaoIdAndIp(Long votacaoId, String ip);

    long countByVotacaoIdAndOpcao(Long votacaoId, OpcaoVoto opcao);

    void deleteByVotacaoId(Long votacaoId);
}
