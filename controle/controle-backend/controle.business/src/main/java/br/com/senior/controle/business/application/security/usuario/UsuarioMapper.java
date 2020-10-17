package br.com.senior.controle.business.application.security.usuario;

import br.com.senior.controle.business.entity.security.Usuario;
import br.com.senior.controle.business.application.security.usuario.dto.*;
import br.com.senior.controle.business.application.security.usuario.usecase.*;
import org.mapstruct.IterableMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper
public interface UsuarioMapper {

    UsuarioDto toUsuarioDto(Usuario entity);

	@IterableMapping(elementTargetType = UsuarioResumoDto.class)
	List<UsuarioResumoDto> toListUsuarioResumoDto(Iterable<Usuario> entities);

    Usuario toUsuario(UcIncluirUsuario dto);

    @Mapping(target = "nome", ignore = true)
    @Mapping(target = "tipoUsuario", ignore = true)
    @Mapping(target = "username", ignore = true)
    void updateUsuario(UcAlterarUsuario dto, @MappingTarget Usuario entity);
}
