package br.com.senior.controle.business.application.security.usecase.carro;

import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import br.com.senior.controle.lib.business.application.validation.ValidString;

import br.com.senior.controle.business.application.security.mappers.CarroMapper;
import br.com.senior.controle.business.entity.security.Carro;
import br.com.senior.controle.business.repository.security.CarroRepository;
import br.com.senior.controle.lib.business.application.usecase.UseCase;
import br.com.senior.controle.business.application.security.dto.CarroDto;
import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class UcIncluirCarro extends UseCase<CarroDto> {

    @Autowired
    private CarroRepository repository;

    @ValidString(name = "page.security.carro.field.descricao", required = true)
    private String descricao;
    private String placa;
    private String renavam;
    private String vendedor;
    private String comprador;
    private BigDecimal valorCompra;
    private BigDecimal valorVenda;
    private LocalDate data;
    @Override
    protected CarroDto execute() {
        Carro dto = map(CarroMapper.class).toCarro(this);
        repository.save(dto);
        return map(CarroMapper.class).toCarroDto(dto);
    }
}
