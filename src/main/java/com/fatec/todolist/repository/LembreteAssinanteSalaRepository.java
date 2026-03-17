package com.fatec.todolist.repository;

import com.fatec.todolist.entity.LembreteAssinanteSala;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LembreteAssinanteSalaRepository extends JpaRepository<LembreteAssinanteSala, Long> {
    List<LembreteAssinanteSala> findByAssinanteIdAndAtivoTrue(Long assinanteId);
    void deleteByAssinanteId(Long assinanteId);
}
