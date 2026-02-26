package com.gerenciamento.copimais.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.gerenciamento.copimais.config.UsuarioSessao;
import com.gerenciamento.copimais.model.Usuario;
import com.gerenciamento.copimais.repository.UsuarioRepository;

import jakarta.transaction.Transactional;

import com.gerenciamento.copimais.dtos.UsuarioDTO.UsuarioResponse;
import com.gerenciamento.copimais.dtos.UsuarioDTO.UsuarioCreateRequest;
import com.gerenciamento.copimais.dtos.UsuarioDTO.AlterarSenhaRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository repository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final UsuarioSessao sessao;

    public List<UsuarioResponse> listarTodos() {
        return repository.findAll().stream()
                .map(u -> new UsuarioResponse(u.getId(), u.getUsername(), u.getAtivo()))
                .toList();
    }

    @Transactional
    public void alterarSenha(AlterarSenhaRequest request) {
 
        Usuario usuario = repository.findById(sessao.getId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        if (!passwordEncoder.matches(request.senhaAntiga(), usuario.getSenha())) {
            throw new RuntimeException("Senha antiga incorreta.");
        }

        usuario.setSenha(passwordEncoder.encode(request.senhaNova()));
        repository.save(usuario);
    }

    @Transactional
    public UsuarioResponse criarUsuario(UsuarioCreateRequest request) {
        Usuario user = new Usuario();
        user.setUsername(request.username());
        user.setSenha(passwordEncoder.encode(request.senha()));
        user.setAtivo(true);
        
        Usuario salvo = repository.save(user);
        return new UsuarioResponse(salvo.getId(), salvo.getUsername(), salvo.getAtivo());
    }
}
