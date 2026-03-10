package com.fatec.todolist.repository;

import com.fatec.todolist.entity.SalaDeAula;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SalaDeAulaRepository extends JpaRepository<SalaDeAula, Integer> {

    Optional<SalaDeAula> findByCodigoConvite(String codigoConvite);

    boolean existsByCodigoConvite(String codigoConvite);
}
