package com.fatec.todolist.repository;

import com.fatec.todolist.entity.Materia;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MateriaRepository extends JpaRepository<Materia, Long> {

    @EntityGraph(attributePaths = "sala")
    @Query("""
        select m
        from Materia m
        where m.sala.id = :salaId
        order by m.nome asc
    """)
    List<Materia> findBySalaIdOrderByNomeAsc(@Param("salaId") Integer salaId);

    List<Materia> findBySalaId(Integer salaId);
}
