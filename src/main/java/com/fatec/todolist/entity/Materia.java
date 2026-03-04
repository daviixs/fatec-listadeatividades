package com.fatec.todolist.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "materia")
public class Materia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    private String professor;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "sala_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_materia_sala")
    )
    private SalaDeAula sala;
}