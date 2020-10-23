package br.com.senior.controle.business.application.security.usecase.carro;

import com.querydsl.core.BooleanBuilder;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;

import br.com.senior.controle.lib.business.application.usecase.impl.ListaPaginada;
import br.com.senior.controle.lib.business.application.usecase.impl.QueryPaginada;
import br.com.senior.controle.business.entity.security.Carro;
import br.com.senior.controle.business.application.security.dto.CarroResumoDto;
import br.com.senior.controle.business.repository.security.CarroRepository;
import br.com.senior.controle.business.application.security.mappers.CarroResumoMapper;

import java.math.BigDecimal;
import java.time.LocalDate;

import static br.com.senior.controle.business.entity.security.QCarro.carro;
import static br.com.senior.controle.lib.business.application.commom.QueryDslExpressionUtils.*;

@Setter
public class UcListarCarro extends QueryPaginada<ListaPaginada<CarroResumoDto>> {

    @Autowired
    private CarroRepository repository;

    private String descricao;
    private String placa;
    private String renavam;
    private String vendedor;
    private String comprador;
    private BigDecimal valorCompra;
    private BigDecimal valorVenda;
    private String[] data;
    private LocalDate dataInicial;
    private LocalDate dataFinal;

    @Override
    protected ListaPaginada<CarroResumoDto> execute() {

        BooleanBuilder filtro = new BooleanBuilder();
	    filtro.and(nullSafeContainsIgnoreCase(carro.descricao, descricao));
        filtro.and(nullSafeContainsIgnoreCase(carro.placa, placa));
        filtro.and(nullSafeContainsIgnoreCase(carro.renavam, renavam));
        filtro.and(nullSafeContainsIgnoreCase(carro.vendedor, vendedor));
        filtro.and(nullSafeContainsIgnoreCase(carro.comprador, comprador));
        filtro.and(nullSafeEq(carro.valorCompra, valorCompra));
        filtro.and(nullSafeEq(carro.valorVenda, valorVenda));

        Page<Carro> page = repository.findAll(filtro, getPage());
        return new ListaPaginada<>(page.getTotalElements(), page.getTotalPages(),
            map(CarroResumoMapper.class).toListCarroResumoDto(page.getContent()));
    }
}
