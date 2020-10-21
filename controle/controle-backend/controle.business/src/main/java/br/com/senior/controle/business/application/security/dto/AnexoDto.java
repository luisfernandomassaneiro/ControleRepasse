package br.com.senior.controle.business.application.security.dto;

import lombok.Data;

@Data
public class AnexoDto {
    private Long id;
    private byte[] file;
    private String fileName;
    private String mimeType;
}
