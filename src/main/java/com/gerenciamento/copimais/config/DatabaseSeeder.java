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
          String senhaPura = "admin123";
          String senhaHash = passwordEncoder.encode(senhaPura);
        
          Usuario admin = new Usuario();
          admin.setUsername("admin");
          admin.setSenha(senhaHash);
          admin.setAtivo(true);
          usuarioRepository.save(admin);

          System.out.println("DEBUG: Usuario 'admin' criado.");
          System.out.println("DEBUG: Senha Pura: " + senhaPura);
          System.out.println("DEBUG: Hash gerado: " + senhaHash);
        }
    }
}