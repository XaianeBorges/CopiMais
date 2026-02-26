package com.gerenciamento.copimais.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gerenciamento.copimais.config.UsuarioSessao;
import com.gerenciamento.copimais.service.DashboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;
    private final UsuarioSessao sessao;

    @GetMapping
    public ResponseEntity<?> getResumo() {
        if (!sessao.isLogado()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        return ResponseEntity.ok(dashboardService.gerarResumoHoje());
    }
}