package com.gerenciamento.copimais.dtos;

import java.math.BigDecimal;

public record ProdutoVendidoDTO(String nome, int quantidade, BigDecimal totalGerado) {}