package br.com.senior.controle.business.application.security.usecase.carro;

import br.com.senior.controle.business.entity.security.Anexo;
import br.com.senior.controle.business.repository.security.AnexoRepository;
import br.com.senior.controle.lib.business.application.usecase.impl.IdentifiedUseCase;
import com.querydsl.core.BooleanBuilder;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

import static br.com.senior.controle.business.entity.security.QAnexo.anexo;

public class UcObterImagensCarro extends IdentifiedUseCase<List<Anexo>, Long> {

	@Autowired
	private AnexoRepository repository;

	@Override
	protected List<Anexo> execute() {
		BooleanBuilder bb = new BooleanBuilder();
		bb.and(anexo.carro.id.eq(getId()));
		return (List<Anexo>) repository.findAll(bb);
	}
}
