package br.com.senior.controle.external.api.security.dominio;

import br.com.senior.controle.business.application.security.dto.AnexoDto;
import br.com.senior.controle.business.application.security.usecase.carro.UcExcluirAnexo;
import br.com.senior.controle.business.application.security.usecase.carro.UcIncluirAnexo;
import br.com.senior.controle.business.application.security.usecase.carro.UcObterAnexo;
import br.com.senior.controle.business.application.security.usecase.carro.UcObterImagensCarro;
import br.com.senior.controle.business.entity.security.Anexo;
import br.com.senior.controle.lib.business.application.usecase.UseCaseFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.util.InMemoryResource;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("api/shared/anexo")
public class AnexoController {

    private final UseCaseFacade facade;

    @Autowired
    public AnexoController(UseCaseFacade facade) { this.facade = facade; }

    @PostMapping("/salvar")
    public AnexoDto salvar(@RequestParam("arquivo") MultipartFile arquivo,
                           @RequestParam(value = "carroId", required = false) Long carroId) {
        UcIncluirAnexo uc = new UcIncluirAnexo();
        uc.setMimeType(arquivo.getContentType());
        uc.setFileName(arquivo.getOriginalFilename());
        uc.setCarroId(carroId);
        try {
            uc.setFile(arquivo.getBytes());
        } catch (IOException e) {
            e.printStackTrace();
        }
        return facade.execute(uc);
    }

    @GetMapping("/busca-imagens/{carroId}")
    public List<Anexo> buscaImagens(@PathVariable Long carroId) {
        return facade.execute(new UcObterImagensCarro().withId(carroId));
    }

    @GetMapping(path = "/donwload/{id}")
    public ResponseEntity<Resource> downloadAttachment(@PathVariable Long id) {
        AnexoDto anexoDto = facade.execute(new UcObterAnexo().withId(id));
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(anexoDto.getMimeType()))
                .body(new InMemoryResource(anexoDto.getFile()));
    }

    @DeleteMapping("{id}")
    public void excluir(@PathVariable Long id) {
        facade.execute(new UcExcluirAnexo().withId(id));
    }

}
