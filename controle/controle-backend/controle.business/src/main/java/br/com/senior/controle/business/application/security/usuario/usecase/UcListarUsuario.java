package br.com.senior.controle.business.application.security.usuario.usecase;

import br.com.senior.controle.business.application.security.usuario.UsuarioMapper;
import br.com.senior.controle.business.application.security.usuario.dto.UsuarioResumoDto;
import br.com.senior.controle.business.entity.security.Usuario;
import br.com.senior.controle.business.repository.security.UsuarioRepository;
import br.com.senior.controle.lib.business.application.usecase.impl.ListaPaginada;
import br.com.senior.controle.lib.business.application.usecase.impl.QueryPaginada;
import com.querydsl.core.BooleanBuilder;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;

import static br.com.senior.controle.business.entity.security.QUsuario.usuario;
import static br.com.senior.controle.lib.business.application.commom.QueryDslExpressionUtils.nullSafeContainsIgnoreCase;
import static br.com.senior.controle.lib.business.application.commom.QueryDslExpressionUtils.nullSafeEq;

@Setter
public class UcListarUsuario extends QueryPaginada<ListaPaginada<UsuarioResumoDto>> {

    @Autowired
    private UsuarioRepository repository;

    @Override
    protected ListaPaginada<UsuarioResumoDto> execute() {

        BooleanBuilder filtro = new BooleanBuilder();
        filtro.and(nullSafeEq(usuario.username, username));
	    filtro.and(nullSafeContainsIgnoreCase(usuario.nome, nome));
	    filtro.and(nullSafeContainsIgnoreCase(usuario.email, email));
	    filtro.and(nullSafeEq(usuario.active, active));
	    filtro.and(nullSafeContainsIgnoreCase(usuario.recoveryCode, recoveryCode));

        Page<Usuario> page = repository.findAll(filtro, getPage());
        return new ListaPaginada<>(page.getTotalElements(), page.getTotalPages(),
            map(UsuarioMapper.class).toListUsuarioResumoDto(page.getContent()));
    }

    private String username;

    private String nome;

    private String email;

    private Boolean active;

    private String recoveryCode;

}