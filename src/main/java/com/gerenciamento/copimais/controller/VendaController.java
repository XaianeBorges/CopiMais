package com.gerenciamento.copimais.controller;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gerenciamento.copimais.config.UsuarioSessao;
import com.gerenciamento.copimais.dtos.VendaRequestDTO;
import com.gerenciamento.copimais.dtos.VendaResponseDTO;
import com.gerenciamento.copimais.service.VendaService;

@RestController
@RequestMapping("/api/vendas")
public class VendaController {

    private final VendaService vendaService;
    private final UsuarioSessao sessao; 

    public VendaController(VendaService vendaService, UsuarioSessao sessao) {
        this.vendaService = vendaService;
        this.sessao = sessao;
    }

    @PostMapping
    public ResponseEntity<?> criarVenda(@RequestBody VendaRequestDTO request) {
        // Validação manual que combinamos:
        if (!sessao.isLogado()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Logue para vender");
        }
        
        try {
            VendaResponseDTO response = vendaService.realizarVenda(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/historico")
    public ResponseEntity<?> listarHistorico() {
        if (!sessao.isLogado()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acesso negado.");
        }

        try {
            List<VendaResponseDTO> historico = vendaService.listarTodas();
            return ResponseEntity.ok(historico);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro ao buscar histórico: " + e.getMessage());
        }
    }
}
