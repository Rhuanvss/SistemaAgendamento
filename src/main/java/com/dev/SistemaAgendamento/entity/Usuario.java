package com.dev.SistemaAgendamento.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column (nullable = false, length = 100)
    private String nome;

    @Column (nullable = false, unique = true,length = 100)
    private String email;

    @Column (nullable = false, length = 20)
    private String telefone;

    public Usuario(String nome, String email, String telefone) {
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
    }

    public Usuario() {
    }
}
