package br.com.senior.controle.business.application.security.usecase.carro;

import br.com.senior.controle.business.application.security.dto.AnexoDto;
import br.com.senior.controle.business.application.security.mappers.AnexoMapper;
import br.com.senior.controle.business.entity.security.Anexo;
import br.com.senior.controle.business.entity.security.Carro;
import br.com.senior.controle.business.repository.security.AnexoRepository;
import br.com.senior.controle.lib.business.application.usecase.UseCase;
import br.com.senior.controle.lib.business.application.validation.ValidString;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;

@Getter
@Setter
public class UcIncluirAnexo extends UseCase<AnexoDto> {

    @Autowired
    private AnexoRepository repository;

    private byte[] file;
    @ValidString(name = "page.shared.anexo.field.filename", required = true)
    private String fileName;
    private String mimeType;
    private Long carroId;
    @Override
    protected AnexoDto execute() {
        Anexo entity = map(AnexoMapper.class).toAnexo(this);
        entity.setCarro(new Carro(carroId));
        repository.save(entity);
        return map(AnexoMapper.class).toAnexoDto(entity);
    }
}