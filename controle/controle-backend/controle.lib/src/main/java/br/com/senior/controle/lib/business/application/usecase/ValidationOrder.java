package br.com.senior.controle.lib.business.application.usecase;

import br.com.senior.controle.lib.business.application.validation.LazyValidation;

import javax.validation.GroupSequence;
import javax.validation.groups.Default;

@GroupSequence({Default.class, LazyValidation.class})
public interface ValidationOrder {
}
