package com.gerenciamento.copimais.model;

import java.util.List;

import jakarta.persistence.*;

@Entity
@Table(name = "usuario")    
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String senha;

    @Column(nullable = false)
        private Boolean ativo = true;
    
    @OneToMany(mappedBy = "usuario")
    private List<Venda> vendas;
}
