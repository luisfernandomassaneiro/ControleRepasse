package br.com.senior.controle.business.application.security.dominio;

import br.com.senior.controle.business.application.security.usuario.dto.UsuarioResumoDto;
import br.com.senior.controle.business.entity.security.QUsuario;
import br.com.senior.controle.business.repository.security.UsuarioRepository;
import br.com.senior.controle.lib.business.application.usecase.UseCaseDominio;
import br.com.senior.controle.lib.business.application.usecase.impl.ListaPaginada;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.QBean;

public class UcObterDominioUsuarios extends UseCaseDominio<UsuarioResumoDto, Long, UsuarioRepository> {
    @Override
    protected ListaPaginada<UsuarioResumoDto> execute() {
        QBean<UsuarioResumoDto> projection = Projections.bean(UsuarioResumoDto.class, QUsuario.usuario.id, QUsuario.usuario.username, QUsuario.usuario.nome, QUsuario.usuario.email, QUsuario.usuario.active);
        return query(null, projection, QUsuario.usuario.nome);
    }
}
