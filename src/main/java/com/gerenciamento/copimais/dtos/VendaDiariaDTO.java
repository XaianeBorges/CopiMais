package com.gerenciamento.copimais.dtos;

import java.math.BigDecimal;
import java.time.LocalDate;

public record VendaDiariaDTO(LocalDate data, BigDecimal total, long quantidadeVendas) {}