package com.gerenciamento.copimais.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.gerenciamento.copimais.dtos.DashboardDTO;
import com.gerenciamento.copimais.dtos.ProdutoEstoqueBaixoDTO;
import com.gerenciamento.copimais.model.Venda;
import com.gerenciamento.copimais.repository.ProdutoRepository;
import com.gerenciamento.copimais.repository.VendaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final VendaRepository vendaRepository;
    private final ProdutoRepository produtoRepository;

    public DashboardDTO gerarResumoHoje() {

        LocalDateTime inicio = LocalDate.now().atStartOfDay();
        LocalDateTime fim = LocalDate.now().atTime(LocalTime.MAX);

        List<Venda> vendasHoje = vendaRepository.findByDataVendaBetween(inicio, fim);

        BigDecimal totalGeral = vendasHoje.stream()
                .map(Venda::getValorTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalPix = filtrarPorPagamento(vendasHoje, "PIX");
        BigDecimal totalCartao = filtrarPorPagamento(vendasHoje, "CARTAO");
        BigDecimal totalDinheiro = filtrarPorPagamento(vendasHoje, "DINHEIRO");

        List<ProdutoEstoqueBaixoDTO> estoqueBaixo = produtoRepository.findByQuantidadeEstoqueLessThanEqual(5)
                .stream()
                .map(p -> new ProdutoEstoqueBaixoDTO(p.getNome(), p.getQuantidadeEstoque()))
                .toList();

        return new DashboardDTO(
                totalGeral,
                totalPix,
                totalCartao,
                totalDinheiro,
                (long) vendasHoje.size(),
                estoqueBaixo
        );
    }

    private BigDecimal filtrarPorPagamento(List<Venda> vendas, String forma) {
        return vendas.stream()
                .filter(v -> forma.equalsIgnoreCase(v.getFormaPagamento()))
                .map(Venda::getValorTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}