package com.seucalendarioacademico.repository;

import com.seucalendarioacademico.entity.LembreteEnvioItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LembreteEnvioItemRepository extends JpaRepository<LembreteEnvioItem, Long> {
    Optional<LembreteEnvioItem> findByJobIdAndAssinanteId(Long jobId, Long assinanteId);
}
