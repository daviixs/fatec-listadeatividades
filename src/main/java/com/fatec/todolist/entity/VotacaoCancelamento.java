package com.fatec.todolist.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "votacao_cancelamento")
public class VotacaoCancelamento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime iniciadaEm;

    @Column(nullable = false)
    private LocalDateTime encerraEm;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusVotacao status = StatusVotacao.ABERTA;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "atividade_id", nullable = false, unique = true,
            foreignKey = @ForeignKey(name = "fk_votacao_atividade"))
    private Atividade atividade;
}
