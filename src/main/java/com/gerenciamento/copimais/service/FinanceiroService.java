package com.gerenciamento.copimais.service;

import com.gerenciamento.copimais.dtos.*;
import com.gerenciamento.copimais.model.*;
import com.gerenciamento.copimais.repository.VendaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FinanceiroService {

    private final VendaRepository vendaRepository;

    public RelatorioDetalhadoDTO gerarRelatorioMensal(int mes, int ano) {
        LocalDateTime inicio = LocalDate.of(ano, mes, 1).atStartOfDay();
        LocalDateTime fim = inicio.with(TemporalAdjusters.lastDayOfMonth()).with(LocalTime.MAX);
        List<Venda> vendas = vendaRepository.findByDataVendaBetween(inicio, fim);

        BigDecimal faturamento = vendas.stream()
                .map(Venda::getValorTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal despesas = vendas.stream()
                .flatMap(v -> v.getItens().stream())
                .map(i -> {
                    BigDecimal custo = i.getPrecoCompraUnitario() != null ? i.getPrecoCompraUnitario() : BigDecimal.ZERO;
                    return custo.multiply(new BigDecimal(i.getQuantidade()));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalDinheiro = filtrarPorPagamento(vendas, "DINHEIRO");
        BigDecimal totalPix = filtrarPorPagamento(vendas, "PIX");
        BigDecimal totalCartao = filtrarPorPagamento(vendas, "CARTAO");

        Map<LocalDate, List<Venda>> agrupadoPorDia = vendas.stream()
                .collect(Collectors.groupingBy(v -> v.getDataVenda().toLocalDate()));

        List<VendaDiariaDTO> vendasDiarias = agrupadoPorDia.entrySet().stream()
                .map(e -> new VendaDiariaDTO(
                    e.getKey(), 
                    e.getValue().stream().map(Venda::getValorTotal).reduce(BigDecimal.ZERO, BigDecimal::add),
                    (long) e.getValue().size()
                ))
                .sorted(Comparator.comparing(VendaDiariaDTO::data))
                .toList();

        Map<String, List<ItemVenda>> agrupadoPorItem = vendas.stream()
                .flatMap(v -> v.getItens().stream())
                .collect(Collectors.groupingBy(i -> i.getProduto() != null ? i.getProduto().getNome() : i.getServico().getNome()));

        List<ProdutoVendidoDTO> produtosVendidos = agrupadoPorItem.entrySet().stream()
                .map(e -> new ProdutoVendidoDTO(
                    e.getKey(),
                    e.getValue().stream().mapToInt(ItemVenda::getQuantidade).sum(),
                    e.getValue().stream()
                        .map(i -> i.getPrecoVendaUnitario().multiply(new BigDecimal(i.getQuantidade())))
                        .reduce(BigDecimal.ZERO, BigDecimal::add)
                ))
                .sorted(Comparator.comparing(ProdutoVendidoDTO::quantidade).reversed())
                .toList();

        return new RelatorioDetalhadoDTO(
            faturamento, 
            faturamento.subtract(despesas), 
            despesas, 
            totalDinheiro, 
            totalPix,      
            totalCartao,
            vendasDiarias, 
            produtosVendidos
        );
    } 

    private BigDecimal filtrarPorPagamento(List<Venda> vendas, String forma) {
        return vendas.stream()
            .filter(v -> forma.equalsIgnoreCase(v.getFormaPagamento()))
            .map(Venda::getValorTotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}