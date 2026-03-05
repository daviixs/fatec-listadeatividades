package com.fatec.todolist.repository;

import com.fatec.todolist.entity.Materia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MateriaRepository extends JpaRepository<Materia, Long> {
    List<Materia> findBySalaId(Integer salaId);
}
