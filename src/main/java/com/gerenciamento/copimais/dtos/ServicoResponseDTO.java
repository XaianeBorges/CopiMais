package com.gerenciamento.copimais.dtos;

import java.math.BigDecimal;

public record ServicoResponseDTO(
    Long id,
    String nome,
    String descricao,
    BigDecimal preco,
    BigDecimal precoCusto,
    Boolean ativo
) {}
