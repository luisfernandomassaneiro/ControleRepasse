package br.com.senior.controle.business.application.security.mappers;

import org.mapstruct.IterableMapping;
import org.mapstruct.Mapper;
import java.util.List;

import br.com.senior.controle.business.entity.security.Carro;
import br.com.senior.controle.business.application.security.dto.CarroResumoDto;
import br.com.senior.controle.business.application.security.dto.CarroDto;

@Mapper
public interface CarroResumoMapper {
	@IterableMapping(elementTargetType = CarroResumoDto.class)
	List<CarroResumoDto> toListCarroResumoDto(Iterable<Carro> entities);
	CarroDto toCarroDto(Carro entity);
}
