package com.gerenciamento.copimais.controller;

import com.gerenciamento.copimais.dtos.UsuarioDTO.*;
import com.gerenciamento.copimais.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<List<UsuarioResponse>> listar() {
        return ResponseEntity.ok(usuarioService.listarTodos());
    }

    @PutMapping("/alterar-senha")
    public ResponseEntity<String> alterarSenha(@RequestBody AlterarSenhaRequest request) {
        try {
            usuarioService.alterarSenha(request);
            return ResponseEntity.ok("Senha alterada com sucesso!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<UsuarioResponse> criar(@RequestBody UsuarioCreateRequest request) {
        return ResponseEntity.ok(usuarioService.criarUsuario(request));
    }
}
