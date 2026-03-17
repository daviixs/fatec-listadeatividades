package com.fatec.todolist.repository;

import com.fatec.todolist.entity.Atividade;
import com.fatec.todolist.entity.StatusAtividade;
import com.fatec.todolist.entity.TipoAtividade;
import com.fatec.todolist.entity.StatusAprovacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface AtividadeRepository extends JpaRepository<Atividade, Long> {
    List<Atividade> findByPrazoBetween(LocalDate inicio, LocalDate fim);
    List<Atividade> findByMateriaId(Long materiaId);

    @Query("""
        select a
        from Atividade a
        join fetch a.materia m
        join fetch m.sala s
        where s.id in :salaIds
          and a.status = :status
          and a.prazo >= :hoje
        order by a.prazo asc
    """)
    List<Atividade> findPendentesBySalaIds(
            @Param("salaIds") List<Integer> salaIds,
            @Param("status") StatusAtividade status,
            @Param("hoje") LocalDate hoje
    );

    @Query("SELECT a FROM Atividade a JOIN a.materia m WHERE m.sala.id = :salaId")
    List<Atividade> findBySalaId(@Param("salaId") Integer salaId);

    @Query("""
        SELECT a FROM Atividade a
        JOIN a.materia m
        WHERE m.sala.id = :salaId
        AND a.statusAprovacao = :statusAprovacao
    """)
    List<Atividade> findBySalaIdAndStatusAprovacao(
        @Param("salaId") Integer salaId,
        @Param("statusAprovacao") StatusAprovacao statusAprovacao
    );

    @Query("""
        SELECT a FROM Atividade a
        JOIN a.materia m
        WHERE m.sala.id = :salaId
        AND a.tipo = :tipo
    """)
    List<Atividade> findBySalaIdAndTipo(
        @Param("salaId") Integer salaId,
        @Param("tipo") TipoAtividade tipo
    );

    @Query("""
        SELECT a FROM Atividade a
        JOIN a.materia m
        WHERE m.sala.id = :salaId
        AND a.tipo = :tipo
        AND a.statusAprovacao = :statusAprovacao
    """)
    List<Atividade> findBySalaIdAndTipoAndStatusAprovacao(
        @Param("salaId") Integer salaId,
        @Param("tipo") TipoAtividade tipo,
        @Param("statusAprovacao") StatusAprovacao statusAprovacao
    );
}
