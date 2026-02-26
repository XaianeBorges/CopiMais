package com.gerenciamento.copimais.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class AutenticacaoInterceptor implements HandlerInterceptor {

    @Autowired
    private UsuarioSessao sessao;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        
        if (request.getRequestURI().startsWith("/api/auth")) {
            return true;
        }

        if (!sessao.isLogado()) {
            response.setStatus(403); 
            response.getWriter().write("Acesso negado: Faca login primeiro.");
            return false; 
        }

        return true; 
    }
}
