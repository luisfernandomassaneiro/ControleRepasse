package br.com.senior.controle.business.application.security.usecase.carro;

import org.springframework.beans.factory.annotation.Autowired;

import br.com.senior.controle.business.repository.security.CarroRepository;
import br.com.senior.controle.lib.business.application.usecase.impl.IdentifiedUseCase;

public class UcExcluirCarro extends IdentifiedUseCase<Void, Long> {

    @Autowired
    private CarroRepository repository;

    @Override
    protected Void execute() {
        repository.deleteById(getId());
        return null;
    }
}
