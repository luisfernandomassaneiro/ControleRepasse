package br.com.senior.controle.external.api.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import br.com.senior.controle.lib.business.application.usecase.UseCaseFacade;
import br.com.senior.controle.lib.business.application.usecase.impl.ListaPaginada;
import br.com.senior.controle.business.application.security.dto.CarroResumoDto;
import br.com.senior.controle.business.application.security.usecase.carro.UcListarCarro;
import br.com.senior.controle.business.application.security.dto.CarroDto;
import br.com.senior.controle.business.application.security.usecase.carro.UcObterCarro;
import br.com.senior.controle.business.application.security.usecase.carro.UcIncluirCarro;
import br.com.senior.controle.business.application.security.usecase.carro.UcAlterarCarro;
import br.com.senior.controle.business.application.security.usecase.carro.UcExcluirCarro;
import javax.servlet.http.HttpServletResponse;
import br.com.senior.controle.external.reports.JasperReportBuilder;
import br.com.senior.controle.lib.commom.Messages;
import br.com.senior.controle.external.reports.ReportFormatEnum;
import br.com.senior.controle.external.reports.PagedBeanCollectionDataSource;

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

}
