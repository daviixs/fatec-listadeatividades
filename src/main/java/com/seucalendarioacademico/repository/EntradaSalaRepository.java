package com.seucalendarioacademico.repository;

import com.seucalendarioacademico.entity.EntradaSala;
import com.seucalendarioacademico.entity.StatusEntrada;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EntradaSalaRepository extends JpaRepository<EntradaSala, Long> {
    List<EntradaSala> findBySalaIdAndStatus(Integer salaId, StatusEntrada status);

    Optional<EntradaSala> findByAlunoIdAndSalaId(Long alunoId, Integer salaId);
}
