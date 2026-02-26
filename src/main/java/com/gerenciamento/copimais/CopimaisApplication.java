package com.gerenciamento.copimais;

import java.io.File;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CopimaisApplication {

    public static void main(String[] args) {
		
        String userHome = System.getProperty("user.home");
        File dir = new File(userHome + File.separator + "copimais-app");
        
        if (!dir.exists()) {
            boolean created = dir.mkdirs();
            if (created) {
                System.out.println("Diretório de dados criado em: " + dir.getAbsolutePath());
            }
        }
        
        SpringApplication.run(CopimaisApplication.class, args);
    }
}
