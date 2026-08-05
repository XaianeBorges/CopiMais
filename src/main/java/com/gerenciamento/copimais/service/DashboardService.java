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
import java.time.temporal.TemporalAdjusters;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final VendaRepository vendaRepository;
    private final ProdutoRepository produtoRepository;

    public DashboardDTO gerarResumoCompleto() {
        // Datas para HOJE
        LocalDateTime inicioHoje = LocalDate.now().atStartOfDay();
        LocalDateTime fimHoje = LocalDate.now().atTime(LocalTime.MAX);

        // Datas para o MÊS ATUAL
        LocalDateTime inicioMes = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        LocalDateTime fimMes = LocalDate.now().with(TemporalAdjusters.lastDayOfMonth()).atTime(LocalTime.MAX);

        List<Venda> vendasHoje = vendaRepository.findByDataVendaBetween(inicioHoje, fimHoje);
        List<Venda> vendasMes = vendaRepository.findByDataVendaBetween(inicioMes, fimMes);

        // Cálculos Hoje
        BigDecimal faturamentoHoje = calcularTotal(vendasHoje);
        BigDecimal pixHoje = filtrarPorPagamento(vendasHoje, "PIX");
        BigDecimal cartaoHoje = filtrarPorPagamento(vendasHoje, "CARTAO");
        BigDecimal dinheiroHoje = filtrarPorPagamento(vendasHoje, "DINHEIRO");

        // Cálculos Mensais
        BigDecimal faturamentoMes = calcularTotal(vendasMes);
        BigDecimal pixMes = filtrarPorPagamento(vendasMes, "PIX");
        BigDecimal cartaoMes = filtrarPorPagamento(vendasMes, "CARTAO");
        BigDecimal dinheiroMes = filtrarPorPagamento(vendasMes, "DINHEIRO");
        
        // CÁLCULO DE CUSTOS (Gastos com material)
        BigDecimal custosMes = vendasMes.stream()
                .flatMap(v -> v.getItens().stream())
                .map(item -> {
                    // Preço de custo unitário * quantidade
                    BigDecimal custoUnitario = item.getPrecoCompraUnitario() != null ? item.getPrecoCompraUnitario() : BigDecimal.ZERO;
                    return custoUnitario.multiply(new BigDecimal(item.getQuantidade()));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal lucroMes = faturamentoMes.subtract(custosMes);

        List<ProdutoEstoqueBaixoDTO> estoqueBaixo = produtoRepository.findByQuantidadeEstoqueLessThanEqual(5)
                .stream()
                .map(p -> new ProdutoEstoqueBaixoDTO(p.getNome(), p.getQuantidadeEstoque()))
                .toList();

        return new DashboardDTO(
                faturamentoHoje, pixHoje, cartaoHoje, dinheiroHoje, (long) vendasHoje.size(),
                faturamentoMes, custosMes, lucroMes, pixMes, cartaoMes, dinheiroMes,
                estoqueBaixo
        );
    }

    private BigDecimal calcularTotal(List<Venda> vendas) {
        return vendas.stream().map(Venda::getValorTotal).reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal filtrarPorPagamento(List<Venda> vendas, String forma) {
        return vendas.stream()
                .filter(v -> forma.equalsIgnoreCase(v.getFormaPagamento()))
                .map(Venda::getValorTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}