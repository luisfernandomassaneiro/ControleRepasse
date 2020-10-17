package br.com.senior.controle.external.config.security.model;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;
}
