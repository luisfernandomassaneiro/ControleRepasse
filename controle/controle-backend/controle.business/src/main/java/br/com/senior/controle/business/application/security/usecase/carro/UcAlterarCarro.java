package br.com.senior.controle.business.application.security.usecase.carro;

import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import br.com.senior.controle.lib.business.application.validation.ValidString;

import br.com.senior.controle.business.application.security.mappers.CarroMapper;
import br.com.senior.controle.business.entity.security.Carro;
import br.com.senior.controle.business.repository.security.CarroRepository;
import br.com.senior.controle.lib.business.application.usecase.impl.IdentifiedUseCase;
import br.com.senior.controle.business.application.security.dto.CarroDto;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class UcAlterarCarro extends IdentifiedUseCase<CarroDto, Long> {

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
        Carro entity = repository.require(getId());
        map(CarroMapper.class).updateCarro(this, entity);
        repository.save(entity);
        return map(CarroMapper.class).toCarroDto(entity);
    }
}
