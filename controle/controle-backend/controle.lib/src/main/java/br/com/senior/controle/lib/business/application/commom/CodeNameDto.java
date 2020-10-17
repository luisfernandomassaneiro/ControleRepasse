package br.com.senior.controle.lib.business.application.commom;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CodeNameDto implements Serializable {

    private Long id;
    private String nome;

    @Override
    public String toString() {
        return nome;
    }
}
