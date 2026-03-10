package com.fatec.todolist.repository;

import com.fatec.todolist.entity.OpcaoVoto;
import com.fatec.todolist.entity.Voto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VotoRepository extends JpaRepository<Voto, Long> {
    boolean existsByVotacaoIdAndAlunoId(Long votacaoId, Long alunoId);

    long countByVotacaoIdAndOpcao(Long votacaoId, OpcaoVoto opcao);
}
