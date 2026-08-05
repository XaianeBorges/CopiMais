package com.gerenciamento.copimais.controller;

import com.gerenciamento.copimais.dtos.RelatorioDetalhadoDTO;
import com.gerenciamento.copimais.service.FinanceiroService;
import com.gerenciamento.copimais.config.UsuarioSessao;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final FinanceiroService financeiroService;
    private final UsuarioSessao sessao;

    @GetMapping("/detalhado")
    public ResponseEntity<?> getRelatorioDetalhado(
            @RequestParam int mes, 
            @RequestParam int ano) {

        if (!sessao.isLogado()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acesso negado.");
        }

        try {
            RelatorioDetalhadoDTO relatorio = financeiroService.gerarRelatorioMensal(mes, ano);
            return ResponseEntity.ok(relatorio);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao gerar relatório: " + e.getMessage());
        }
    }
}