package com.seucalendarioacademico.repository;

import com.seucalendarioacademico.entity.Atividade;
import com.seucalendarioacademico.entity.StatusAtividade;
import com.seucalendarioacademico.entity.TipoAtividade;
import com.seucalendarioacademico.entity.StatusAprovacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface AtividadeRepository extends JpaRepository<Atividade, Long> {
    @Query("""
        select a
        from Atividade a
        join fetch a.materia m
        join fetch m.sala s
        where a.prazo between :inicio and :fim
        order by a.prazo asc, a.id asc
    """)
    List<Atividade> findDetalhadasByPrazoBetween(
            @Param("inicio") LocalDate inicio,
            @Param("fim") LocalDate fim
    );

    @Query("""
        select a
        from Atividade a
        join fetch a.materia m
        join fetch m.sala s
        where m.id = :materiaId
        order by a.prazo asc, a.id asc
    """)
    List<Atividade> findDetalhadasByMateriaId(@Param("materiaId") Long materiaId);

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

    @Query("""
        select a
        from Atividade a
        join fetch a.materia m
        join fetch m.sala s
        where s.id = :salaId
        order by a.prazo asc, a.id asc
    """)
    List<Atividade> findDetalhadasBySalaId(@Param("salaId") Integer salaId);

    @Query("""
        select a
        from Atividade a
        join fetch a.materia m
        join fetch m.sala s
        where s.id = :salaId
          and a.statusAprovacao = :statusAprovacao
        order by a.prazo asc, a.id asc
    """)
    List<Atividade> findDetalhadasBySalaIdAndStatusAprovacao(
        @Param("salaId") Integer salaId,
        @Param("statusAprovacao") StatusAprovacao statusAprovacao
    );

    @Query("""
        select a
        from Atividade a
        join fetch a.materia m
        join fetch m.sala s
        where s.id = :salaId
          and a.tipo = :tipo
        order by a.prazo asc, a.id asc
    """)
    List<Atividade> findDetalhadasBySalaIdAndTipo(
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
