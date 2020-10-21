package br.com.senior.controle.business.application.security.usecase.carro;

import br.com.senior.controle.business.application.security.dto.AnexoDto;
import br.com.senior.controle.business.application.security.mappers.AnexoMapper;
import br.com.senior.controle.business.repository.security.AnexoRepository;
import br.com.senior.controle.lib.business.application.usecase.impl.IdentifiedUseCase;
import org.springframework.beans.factory.annotation.Autowired;

public class UcObterAnexo extends IdentifiedUseCase<AnexoDto, Long> {

	@Autowired
	private AnexoRepository repository;

	@Override
	protected AnexoDto execute() {
		return map(AnexoMapper.class).toAnexoDto(repository.require(getId()));
	}
}