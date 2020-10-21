package br.com.senior.controle.external.api.security;

import br.com.senior.controle.business.application.security.dto.AnexoDto;
import br.com.senior.controle.business.application.security.usecase.carro.*;
import br.com.senior.controle.business.entity.security.Anexo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import br.com.senior.controle.lib.business.application.usecase.UseCaseFacade;
import br.com.senior.controle.lib.business.application.usecase.impl.ListaPaginada;
import br.com.senior.controle.business.application.security.dto.CarroResumoDto;
import br.com.senior.controle.business.application.security.dto.CarroDto;

import javax.servlet.http.HttpServletResponse;
import br.com.senior.controle.external.reports.JasperReportBuilder;
import br.com.senior.controle.lib.commom.Messages;
import br.com.senior.controle.external.reports.ReportFormatEnum;
import br.com.senior.controle.external.reports.PagedBeanCollectionDataSource;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("api/security/carro")
public class CarroController {

    @Autowired
    private JasperReportBuilder reportBuilder;
    @Autowired
    private Messages messages;

    private final UseCaseFacade facade;

    @Autowired
    public CarroController(UseCaseFacade facade) { this.facade = facade; }

    @GetMapping
    public ListaPaginada<CarroResumoDto> listar(UcListarCarro filtro) { return facade.execute(filtro); }

    @GetMapping("{id}")
    public CarroDto obter(@PathVariable Long id) {
        return facade.execute(new UcObterCarro().withId(id));
    }

    @PostMapping
        public CarroDto inserir(@RequestBody UcIncluirCarro uc) {
        return facade.execute(uc);
    }

    @PostMapping("{id}")
        public CarroDto atualizar(@RequestBody UcAlterarCarro uc) {
        return facade.execute(uc);
    }

    @DeleteMapping("{id}")
        public void excluir(@PathVariable Long id) {
        facade.execute(new UcExcluirCarro().withId(id));
    }

    @GetMapping(value = "export")
    public void exportar(UcListarCarro filtro, HttpServletResponse response, @RequestParam(name = "format") ReportFormatEnum format) {
        reportBuilder.generateReport("carro", null, new PagedBeanCollectionDataSource<>(facade, messages, filtro), response, format);
    }

    @PostMapping("/salvar-imagem")
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

}
