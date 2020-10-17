package br.com.senior.controle.business.application.security.usuario.usecase;

import br.com.senior.controle.business.application.security.usuario.UsuarioMapper;
import br.com.senior.controle.business.application.security.usuario.dto.UsuarioDto;
import br.com.senior.controle.business.repository.security.UsuarioRepository;
import br.com.senior.controle.lib.business.application.usecase.impl.IdentifiedUseCase;
import org.springframework.beans.factory.annotation.Autowired;

public class UcObterUsuario extends IdentifiedUseCase<UsuarioDto, Long> {

    @Autowired
    private UsuarioRepository repository;

    @Override
    protected UsuarioDto execute() {
        return map(UsuarioMapper.class).toUsuarioDto(repository.require(getId()));
    }
}