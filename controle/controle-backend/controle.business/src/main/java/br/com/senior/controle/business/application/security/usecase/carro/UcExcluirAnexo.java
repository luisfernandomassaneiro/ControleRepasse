package br.com.senior.controle.business.application.security.usecase.carro;

import br.com.senior.controle.business.repository.security.AnexoRepository;
import br.com.senior.controle.lib.business.application.usecase.impl.IdentifiedUseCase;
import org.springframework.beans.factory.annotation.Autowired;

public class UcExcluirAnexo extends IdentifiedUseCase<Void, Long> {

    @Autowired
    private AnexoRepository repository;

    @Override
    protected Void execute() {
        repository.deleteById(getId());
        return null;
    }
}
