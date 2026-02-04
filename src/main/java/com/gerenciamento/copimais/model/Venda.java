package com.gerenciamento.copimais.model;

import java.time.LocalDateTime;
import java.util.List;
import java.math.BigDecimal;
import jakarta.persistence.*;

@Entity
@Table(name = "venda")

public class Venda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime dataVenda;

    @Column(nullable = false)
    private BigDecimal valorTotal;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @OneToMany(mappedBy = "venda" , cascade = CascadeType.ALL)
    private List<ItemVenda> itens;




}
