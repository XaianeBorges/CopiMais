package com.gerenciamento.copimais.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Data;


@Data
@Entity

@Table(name = "produto")
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private double preco;
    private int quantidade;
    private String formaPagamento;
    private LocalDateTime dataVenda = LocalDateTime.now();
    
}
