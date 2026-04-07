package com.seucalendarioacademico.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
public class Atividade {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;

    private String descricao;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipoEntrega")
    private TipoEntrega tipoEntrega;

    @Column(name = "link_entrega",
    nullable = true)
    private String linkEntrega;

    @Column(name = "regras",
    nullable = false)
    private String regras;

    private LocalDate prazo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusAtividade status = StatusAtividade.ATIVA;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoAtividade tipo = TipoAtividade.ATIVIDADE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusAprovacao statusAprovacao = StatusAprovacao.APROVADA;

    @Column(name = "criado_por_aluno_id")
    private Long criadoPorAlunoId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "materia_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_materia")
    )
    private Materia materia;

    private LocalDate data;
}