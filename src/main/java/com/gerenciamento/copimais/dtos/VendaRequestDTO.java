package com.gerenciamento.copimais.dtos;


import java.util.List;

public record VendaRequestDTO(
    List<ItemVendaRequestDTO> itens,
    String formaPagamento
) {}
