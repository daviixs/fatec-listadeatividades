package com.fatec.todolist.repository;

import com.fatec.todolist.entity.LembreteEnvioItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LembreteEnvioItemRepository extends JpaRepository<LembreteEnvioItem, Long> {
    Optional<LembreteEnvioItem> findByJobIdAndAssinanteId(Long jobId, Long assinanteId);
}
