package com.fatec.todolist.repository;

import com.fatec.todolist.entity.Atividade;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AtividadeRepository extends JpaRepository<Atividade, Long> {
    List<Atividade> findByPrazoBetween(LocalDate inicio, LocalDate fim);
}