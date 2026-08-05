package com.gerenciamento.copimais.dtos;

import java.math.BigDecimal;

public record ServicoRequestDTO(
    String nome,
    String descricao,
    BigDecimal preco,
    BigDecimal precoCusto
) {}
