package com.gerenciamento.copimais.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import com.gerenciamento.copimais.model.Usuario;
import com.gerenciamento.copimais.repository.UsuarioRepository;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (usuarioRepository.count() == 0) {
            Usuario admin = new Usuario();
            admin.setUsername("admin");
            admin.setSenha(passwordEncoder.encode("admin123"));
            
            usuarioRepository.save(admin);
            
            System.out.println("#########################################");
            System.out.println("# USUÁRIO INICIAL CRIADO: admin / admin123 #");
            System.out.println("#########################################");
        }
    }
}