package com.gerenciamento.copimais.dtos;

import java.math.BigDecimal;
import java.util.List;

public record RelatorioDetalhadoDTO(
    BigDecimal faturamentoTotal,
    BigDecimal lucroLiquido,
    BigDecimal despesasTotais,
    BigDecimal totalDinheiro, 
    BigDecimal totalPix,      
    BigDecimal totalCartao,
    List<VendaDiariaDTO> vendasPorDia,
    List<ProdutoVendidoDTO> produtosMaisVendidos
) {}
