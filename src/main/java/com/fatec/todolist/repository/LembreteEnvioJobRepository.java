package com.fatec.todolist.repository;

import com.fatec.todolist.entity.LembreteEnvioJob;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface LembreteEnvioJobRepository extends JpaRepository<LembreteEnvioJob, Long> {
    Optional<LembreteEnvioJob> findBySlotInicio(LocalDateTime slotInicio);
}
