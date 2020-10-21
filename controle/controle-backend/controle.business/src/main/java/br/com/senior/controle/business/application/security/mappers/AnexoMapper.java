package br.com.senior.controle.business.application.security.mappers;

import br.com.senior.controle.business.application.security.dto.AnexoDto;
import br.com.senior.controle.business.application.security.usecase.carro.UcIncluirAnexo;
import br.com.senior.controle.business.entity.security.Anexo;
import br.com.senior.controle.business.entity.security.Carro;
import org.mapstruct.Mapper;

@Mapper
public interface AnexoMapper {
    AnexoDto toAnexoDto(Anexo entity);
    Anexo toAnexo(UcIncluirAnexo dto);
}
