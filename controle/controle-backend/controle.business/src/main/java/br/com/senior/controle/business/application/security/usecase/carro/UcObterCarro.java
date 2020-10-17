package br.com.senior.controle.business.application.security.usecase.carro;

import org.springframework.beans.factory.annotation.Autowired;

import br.com.senior.controle.business.repository.security.CarroRepository;
import br.com.senior.controle.business.application.security.mappers.CarroResumoMapper;
import br.com.senior.controle.business.application.security.dto.CarroDto;
import br.com.senior.controle.lib.business.application.usecase.impl.IdentifiedUseCase;

public class UcObterCarro extends IdentifiedUseCase<CarroDto, Long> {

	@Autowired
	private CarroRepository repository;

	@Override
	protected CarroDto execute() {
		return map(CarroResumoMapper.class).toCarroDto(repository.require(getId()));
	}
}
