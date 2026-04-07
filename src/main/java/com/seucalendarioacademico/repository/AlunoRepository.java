package com.seucalendarioacademico.repository;

import com.seucalendarioacademico.entity.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AlunoRepository extends JpaRepository<Aluno, Long> {
    Optional<Aluno> findBySalaIdAndRm(Integer salaId, String rm);

    List<Aluno> findBySalaId(Integer salaId);

    long countBySalaId(Integer salaId);

    boolean existsBySalaIdAndRm(Integer salaId, String rm);
}
