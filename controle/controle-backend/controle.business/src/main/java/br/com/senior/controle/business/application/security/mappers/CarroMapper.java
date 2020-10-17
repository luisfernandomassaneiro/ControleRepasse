package br.com.senior.controle.business.application.security.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import br.com.senior.controle.business.entity.security.Carro;
import br.com.senior.controle.business.application.security.dto.CarroDto;
import br.com.senior.controle.business.application.security.usecase.carro.UcAlterarCarro;
import br.com.senior.controle.business.application.security.usecase.carro.UcIncluirCarro;

@Mapper
public interface CarroMapper {
    CarroDto toCarroDto(Carro entity);
    Carro toCarro(UcIncluirCarro dto);
    void updateCarro(UcAlterarCarro dto, @MappingTarget Carro entity);
}
