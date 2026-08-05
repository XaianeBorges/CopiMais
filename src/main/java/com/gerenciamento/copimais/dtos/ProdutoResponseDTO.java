package com.gerenciamento.copimais.dtos;

import java.math.BigDecimal;

public record ProdutoResponseDTO(
    Long id,
    String nome,
    String descricao,
    BigDecimal precoCompra,
    BigDecimal precoVenda,
    Integer quantidadeEstoque,
    Boolean ativo
) {}