package com.gerenciamento.copimais.dtos;

import java.math.BigDecimal;
import java.util.List;

public record DashboardDTO(
    BigDecimal faturamentoTotalHoje,
    BigDecimal totalPix,
    BigDecimal totalCartao,
    BigDecimal totalDinheiro,
    Long totalVendasHoje,
    List<ProdutoEstoqueBaixoDTO> produtosAlertaEstoque
) {}
