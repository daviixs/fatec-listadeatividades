package com.seucalendarioacademico.repository;

import com.seucalendarioacademico.entity.LembreteAssinante;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LembreteAssinanteRepository extends JpaRepository<LembreteAssinante, Long> {
    Optional<LembreteAssinante> findByEmail(String email);
    boolean existsByEmail(String email);
    List<LembreteAssinante> findByAtivoTrue();
}
