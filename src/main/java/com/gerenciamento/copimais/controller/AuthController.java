package com.gerenciamento.copimais.controller;

import com.gerenciamento.copimais.config.UsuarioSessao; 
import com.gerenciamento.copimais.model.Usuario;
import com.gerenciamento.copimais.repository.UsuarioRepository;
import com.gerenciamento.copimais.dtos.UsuarioDTO.UsuarioResponse; 
import com.gerenciamento.copimais.dtos.UsuarioDTO.LoginRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; 
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private UsuarioSessao sessao;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<UsuarioResponse> login(@RequestBody LoginRequest loginDto) {
        Usuario usuario = usuarioRepository.findByUsername(loginDto.username())
                .orElseThrow(() -> new RuntimeException("Usuario nao encontrado"));

        if (passwordEncoder.matches(loginDto.password(), usuario.getSenha())) {
            sessao.logar(usuario);

            return ResponseEntity.ok(new UsuarioResponse(usuario.getId(), usuario.getUsername(), usuario.getAtivo()));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioResponse> getUsuarioLogado() {
        if (sessao.isLogado()) {
            return ResponseEntity.ok(new UsuarioResponse(sessao.getId(), sessao.getUsername(), true));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}
