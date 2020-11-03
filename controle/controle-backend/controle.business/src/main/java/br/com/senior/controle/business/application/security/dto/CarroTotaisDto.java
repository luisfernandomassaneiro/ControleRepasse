package br.com.senior.controle.business.application.security.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.Objects;

@Data
public class CarroTotaisDto {

    private BigDecimal totalCompra = BigDecimal.ZERO;
    private BigDecimal totalVenda = BigDecimal.ZERO;
    private BigDecimal totalLucro = BigDecimal.ZERO;

    public void addValores(BigDecimal valorCompra, BigDecimal valorVenda) {
        if (Objects.isNull(valorCompra)) {
            valorCompra = BigDecimal.ZERO;
        }

        if (Objects.isNull(valorVenda)) {
            valorVenda = BigDecimal.ZERO;
        }

        totalCompra = totalCompra.add(valorCompra);
        totalVenda = totalVenda.add(valorVenda);
        totalLucro = totalLucro.add(valorVenda.subtract(valorCompra));
    }
}
