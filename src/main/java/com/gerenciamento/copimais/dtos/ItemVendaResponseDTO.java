package com.gerenciamento.copimais.dtos;

import java.math.BigDecimal;    

public record ItemVendaResponseDTO(
    String nome,
    Integer quantidade,
    BigDecimal precoUnitario
) {}
