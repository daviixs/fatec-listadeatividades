package com.fatec.todolist.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "voto",
        uniqueConstraints = @UniqueConstraint(name = "uk_voto_aluno_votacao", columnNames = {"votacao_id", "aluno_id"}))
public class Voto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OpcaoVoto opcao;

    @Column(nullable = false)
    private LocalDateTime votadoEm = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "votacao_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_voto_votacao"))
    private VotacaoCancelamento votacao;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "aluno_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_voto_aluno"))
    private Aluno aluno;
}
