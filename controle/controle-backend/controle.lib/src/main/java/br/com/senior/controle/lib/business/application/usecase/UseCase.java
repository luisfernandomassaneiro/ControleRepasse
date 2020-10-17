package br.com.senior.controle.lib.business.application.usecase;

import br.com.senior.controle.lib.commom.CurrentUser;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Autowired;

public abstract class UseCase<T> {

    @Autowired
    protected CurrentUser currentUser;

    protected abstract T execute();

    protected <E> E map(Class<E> clazz){
        return Mappers.getMapper(clazz);
    }
}
