package com.gerenciamento.copimais.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List; 

public record VendaResponseDTO(
    Long id,
    LocalDateTime dataVenda,
    BigDecimal valorTotal,
    String nomeUsuario,
    String formaPagamento,
    List<ItemVendaResponseDTO> itens
) {}
