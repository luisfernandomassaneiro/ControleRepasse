package br.com.senior.controle.business.application.security.usecase.carro;

import br.com.senior.controle.business.application.security.dto.CarroTotaisDto;
import br.com.senior.controle.business.entity.security.Carro;
import br.com.senior.controle.business.repository.security.CarroRepository;
import br.com.senior.controle.lib.business.application.usecase.UseCase;
import com.querydsl.core.BooleanBuilder;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;

import static br.com.senior.controle.business.entity.security.QCarro.carro;
import static br.com.senior.controle.lib.business.application.commom.QueryDslExpressionUtils.*;

@Setter
public class UcListarTotaisCarro extends UseCase<CarroTotaisDto> {

    @Autowired
    private CarroRepository repository;

    private String descricao;
    private String placa;
    private String renavam;
    private String vendedor;
    private String comprador;
    private BigDecimal valorCompra;
    private BigDecimal valorVenda;
    private Date dataInicial;
    private Date dataFinal;

    @Override
    protected CarroTotaisDto execute() {

        BooleanBuilder filtro = new BooleanBuilder();
	    filtro.and(nullSafeContainsIgnoreCase(carro.descricao, descricao));
        filtro.and(nullSafeContainsIgnoreCase(carro.placa, placa));
        filtro.and(nullSafeContainsIgnoreCase(carro.renavam, renavam));
        filtro.and(nullSafeContainsIgnoreCase(carro.vendedor, vendedor));
        filtro.and(nullSafeContainsIgnoreCase(carro.comprador, comprador));
        filtro.and(nullSafeEq(carro.valorCompra, valorCompra));
        filtro.and(nullSafeEq(carro.valorVenda, valorVenda));
        filtro.and(nullSafeBetween(carro.data, dataInicial, dataFinal));

        CarroTotaisDto carroTotaisDto = new CarroTotaisDto();

        List<Carro> carros = (List<Carro>) repository.findAll(filtro);

        carros.forEach(carro -> carroTotaisDto.addValores(carro.getValorCompra(), carro.getValorVenda()));

        return carroTotaisDto;
    }
}
