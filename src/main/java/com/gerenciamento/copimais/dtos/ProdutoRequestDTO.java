package com.gerenciamento.copimais.dtos;

import java.math.BigDecimal;

public record ProdutoRequestDTO(
    String nome,
    String descricao,
    BigDecimal precoCompra,
    BigDecimal precoVenda,
    Integer quantidadeEstoque
) {}