package com.seucalendarioacademico.repository;

import com.seucalendarioacademico.entity.SalaDeAula;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SalaDeAulaRepository extends JpaRepository<SalaDeAula, Integer> {

    List<SalaDeAula> findAllByOrderByNomeAsc();

    Optional<SalaDeAula> findByCodigoConvite(String codigoConvite);

    boolean existsByCodigoConvite(String codigoConvite);
}
