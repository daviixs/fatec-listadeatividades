package com.fatec.todolist.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

enum tipoEntrega{
    LINK_EXTERNO, ENTREGA_MANUAL;
}

@Entity
public class atividade {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;

    private String descricao;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipoEntrega")
    private tipoEntrega tipoEntrega;

    @Column(name = "link_entrega",
    nullable = true)
    private String link_entrega;

    @Column(name = "regras",
    nullable = false)
    private String regras;

    private LocalDate prazo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "materia_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_materia")
    )
    private Materia materia;

    private LocalDate data;
}
