package com.gerenciamento.copimais.dtos;

public record ItemVendaRequestDTO(
    Long id,          
    Integer quantidade,
    String tipo       
) {}
