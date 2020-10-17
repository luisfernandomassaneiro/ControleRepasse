package br.com.senior.controle.lib.business.application.usecase.impl;

import br.com.senior.controle.lib.business.application.usecase.UseCase;
import lombok.Setter;

import javax.validation.constraints.NotNull;

public abstract class IdentifiedUseCase<T, TID> extends UseCase<T> {

    @Setter
    @NotNull(message = "general.validation.id_required")
    private TID id;

    protected TID getId() {
        return id;
    }

    public IdentifiedUseCase<T, TID> withId(TID id) {
        this.id = id;
        return this;
    }
}
