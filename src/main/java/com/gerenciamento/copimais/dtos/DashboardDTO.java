package com.gerenciamento.copimais.dtos;

import java.math.BigDecimal;
import java.util.List;

public record DashboardDTO(

    BigDecimal faturamentoTotalHoje,
    BigDecimal totalPixHoje,
    BigDecimal totalCartaoHoje,
    BigDecimal totalDinheiroHoje,
    Long totalVendasHoje,
     
    BigDecimal faturamentoMensal,
    BigDecimal custosMensal, 
    BigDecimal lucroMensal,   
    BigDecimal totalPixMensal,
    BigDecimal totalCartaoMensal,
    BigDecimal totalDinheiroMensal,
    
    List<ProdutoEstoqueBaixoDTO> produtosAlertaEstoque
) {}