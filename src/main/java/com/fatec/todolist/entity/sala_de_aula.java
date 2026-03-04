package com.fatec.todolist.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "sala_de_aula")
public class SalaDeAula {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nome;

    private String semestre;

    @Column(name = "codigo_convite", nullable = false, unique = true)
    private String codigoConvite;

    @Column(name = "segredo_lider", nullable = false)
    private String segredoLider;

}