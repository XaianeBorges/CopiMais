package com.gerenciamento.copimais.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.math.BigDecimal;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "vendas")
@Data

public class Venda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime dataVenda;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal valorTotal;

    @Column(nullable = false)
    private String formaPagamento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @OneToMany(mappedBy = "venda", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemVenda> itens = new ArrayList<>();

}
