package com.gerenciamento.copimais.model;

import java.math.BigDecimal;
import java.util.List;


import jakarta.persistence.*;

@Entity

@Table(name = "produto")
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    private String descricao;

    @Column(nullable = false)
    private BigDecimal precoCompra;

    @Column(nullable = false)
    private BigDecimal precoVenda;

    @Column(nullable = false)
    private Integer quantidadeEstoque;

    @Column(nullable = false)
    private Boolean ativo = true;

    @OneToMany(mappedBy = "produto")
    private List<ItemVenda> itensVenda;
    
    
}
