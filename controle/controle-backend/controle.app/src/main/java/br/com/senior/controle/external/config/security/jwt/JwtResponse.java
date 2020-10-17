package br.com.senior.controle.external.config.security.jwt;

import br.com.senior.controle.external.config.security.model.SubjectDto;
import lombok.Data;

@Data
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private SubjectDto subject;

    public JwtResponse(String accessToken, SubjectDto subject) {
        this.token = accessToken;
        this.subject = subject;
    }
}