package br.com.senior.controle.business.application.security.dominio;

import br.com.senior.controle.business.entity.security.domain.SexoEnum;
import br.com.senior.controle.lib.business.application.usecase.UseCase;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class UcObterDominioSexo extends UseCase<List<String>> {
    @Override
    protected List<String> execute() {
        return Arrays.stream(SexoEnum.values()).map(Enum::toString).collect(Collectors.toList());
    }
}
