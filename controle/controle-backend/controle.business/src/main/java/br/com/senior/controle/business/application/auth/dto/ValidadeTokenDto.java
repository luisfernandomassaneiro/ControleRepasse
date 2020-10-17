package br.com.senior.controle.business.application.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ValidadeTokenDto {
    private LocalDateTime expiracao;
    private boolean valido;
    private String message;
}
