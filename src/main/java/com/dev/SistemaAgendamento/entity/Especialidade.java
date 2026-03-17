package com.dev.SistemaAgendamento.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
public class Especialidade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false)
    private BigDecimal preco;

    @Column(name = "duracao_minutos", nullable = false)
    private Integer duracao;

    public Especialidade(String nome, BigDecimal preco, Integer duracao) {
        this.nome = nome;
        this.preco = preco;
        this.duracao = duracao;
    }

    public Especialidade() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public BigDecimal getPreco() {
        return preco;
    }

    public void setPreco(BigDecimal preco) {
        this.preco = preco;
    }

    public Integer getDuracao() {
        return duracao;
    }

    public void setDuracao(Integer duracao) {
        this.duracao = duracao;
    }
}
