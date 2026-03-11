package com.dev.SistemaAgendamento.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
public class Servico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column (nullable = false, length = 100)
    private String nome;

    @Column (nullable = false)
    private BigDecimal preco;

    @Column (name = "duracao_minutos", nullable = false)
    private Integer duracao;

    public Servico(String nome, BigDecimal preco, Integer duracao) {
        this.nome = nome;
        this.preco = preco;
        this.duracao = duracao;
    }

    public Servico() {
    }
}
