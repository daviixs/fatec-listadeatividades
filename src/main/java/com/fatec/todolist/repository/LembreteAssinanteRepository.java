package com.fatec.todolist.repository;

import com.fatec.todolist.entity.LembreteAssinante;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LembreteAssinanteRepository extends JpaRepository<LembreteAssinante, Long> {
    Optional<LembreteAssinante> findByEmail(String email);
    List<LembreteAssinante> findByAtivoTrue();
}
