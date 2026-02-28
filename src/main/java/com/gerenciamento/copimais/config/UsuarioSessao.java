package com.gerenciamento.copimais.config;

import com.gerenciamento.copimais.model.Usuario;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.SessionScope;
import java.io.Serializable;
import java.time.LocalDateTime;

@Component
@SessionScope 
public class UsuarioSessao implements Serializable {
    
    private static final long serialVersionUID = 1L;

    private Long id;
    private String username;
    private LocalDateTime dataLogin;

    public void logar(Usuario usuario) {
        this.id = usuario.getId();
        this.username = usuario.getUsername();
        this.dataLogin = LocalDateTime.now();
        System.out.println("DEBUG: Sessão preenchida para: " + this.username); 
    }

    public void deslogar() {
        this.id = null;
        this.username = null;
        this.dataLogin = null;
    }

    public boolean isLogado() {
        return this.id != null;
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public LocalDateTime getDataLogin() { return dataLogin; }
}
