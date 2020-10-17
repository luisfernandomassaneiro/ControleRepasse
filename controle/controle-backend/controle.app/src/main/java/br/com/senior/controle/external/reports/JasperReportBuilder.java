package br.com.senior.controle.external.reports;

import br.com.senior.controle.lib.commom.CurrentUser;
import br.com.senior.controle.lib.commom.Messages;
import lombok.SneakyThrows;
import net.sf.jasperreports.engine.JRDataSource;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.export.HtmlExporter;
import net.sf.jasperreports.engine.export.JRCsvExporter;
import net.sf.jasperreports.engine.export.JRPdfExporter;
import net.sf.jasperreports.engine.export.JRXlsExporter;
import net.sf.jasperreports.engine.export.oasis.JROdsExporter;
import net.sf.jasperreports.engine.export.ooxml.JRXlsxExporter;
import net.sf.jasperreports.export.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpHeaders;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.ui.ModelMap;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.*;
import java.util.function.BiFunction;

@Component
public class JasperReportBuilder {

    private static final String PARAM_USER = "USER";
    private static final String PARAM_DATASOURCE = "DATASOURCE";
    private static final String PARAM_RESOURCE_BUNDLE = "REPORT_RESOURCE_BUNDLE";
    private static final String PARAM_IS_IGNORE_PAGINATION = "IS_IGNORE_PAGINATION";
    private static final String PARAM_LOGO = "LOGO";

    private static final Map<ReportFormatEnum, BiFunction<OutputStream, JasperPrint, Exporter<? extends ExporterInput, ? extends ReportExportConfiguration, ? extends ExporterConfiguration, ? extends ExporterOutput>>> exportersFn;
    static {
        exportersFn = new EnumMap<>(ReportFormatEnum.class);
        exportersFn.put(ReportFormatEnum.HTML, JasperReportBuilder::html);
        exportersFn.put(ReportFormatEnum.CSV, JasperReportBuilder::csv);
        exportersFn.put(ReportFormatEnum.PDF, JasperReportBuilder::pdf);
        exportersFn.put(ReportFormatEnum.XLSX, JasperReportBuilder::xlsx);
        exportersFn.put(ReportFormatEnum.XLS, JasperReportBuilder::xls);
        exportersFn.put(ReportFormatEnum.ODS, JasperReportBuilder::ods);
    }

    private static HtmlExporter html(OutputStream out, JasperPrint print) {
        var htmlEx = new HtmlExporter();
        htmlEx.setExporterOutput(new SimpleHtmlExporterOutput(out));
        htmlEx.setExporterInput(new SimpleExporterInput(print));
        return htmlEx;
    }

    private static JRCsvExporter csv(OutputStream out, JasperPrint print) {
        var csvEx = new JRCsvExporter();
        csvEx.setExporterOutput(new SimpleWriterExporterOutput(out));
        csvEx.setExporterInput(new SimpleExporterInput(print));
        return csvEx;
    }

    private static JRPdfExporter pdf(OutputStream out, JasperPrint print) {
        var pdfEx = new JRPdfExporter();
        pdfEx.setExporterOutput(new SimpleOutputStreamExporterOutput(out));
        pdfEx.setExporterInput(new SimpleExporterInput(print));
        return pdfEx;
    }

    private static JRXlsxExporter xlsx(OutputStream out, JasperPrint print) {
        SimpleXlsxReportConfiguration configuration = new SimpleXlsxReportConfiguration();
        configuration.setOnePagePerSheet(true);
        configuration.setRemoveEmptySpaceBetweenRows(true);
        configuration.setRemoveEmptySpaceBetweenColumns(true);
        configuration.setIgnoreGraphics(false);
        configuration.setFontSizeFixEnabled(false);
        var xlsxEx = new JRXlsxExporter();
        xlsxEx.setConfiguration(configuration);
        xlsxEx.setExporterOutput(new SimpleOutputStreamExporterOutput(out));
        xlsxEx.setExporterInput(new SimpleExporterInput(print));
        return xlsxEx;
    }

    private static JRXlsExporter xls(OutputStream out, JasperPrint print) {
        var xlsEx = new JRXlsExporter();
        xlsEx.setExporterInput(new SimpleExporterInput(print));
        xlsEx.setExporterOutput(new SimpleOutputStreamExporterOutput(out));
        SimpleXlsReportConfiguration xlsConfig = new SimpleXlsReportConfiguration();
        xlsConfig.setOnePagePerSheet(false);
        xlsConfig.setDetectCellType(true);
        xlsConfig.setWhitePageBackground(false);
        xlsConfig.setRemoveEmptySpaceBetweenRows(true);
        xlsConfig.setRemoveEmptySpaceBetweenColumns(true);
        xlsConfig.setIgnoreGraphics(false);
        xlsConfig.setFontSizeFixEnabled(false);
        xlsEx.setConfiguration(xlsConfig);
        return xlsEx;
    }

    private static JROdsExporter ods(OutputStream out, JasperPrint print) {
        var odsEx = new JROdsExporter();
        odsEx.setExporterOutput(new SimpleOutputStreamExporterOutput(out));
        odsEx.setExporterInput(new SimpleExporterInput(print));
        return odsEx;
    }

    @Autowired
    private Messages messages;
    @Autowired
    private CurrentUser subject;

    private Map<String, Object> addParams(Map<String, Object> model, JRDataSource dataSource, ReportFormatEnum format) throws IOException {
        if (model == null) {
            model = new ModelMap();
        }

        if (!model.containsKey(PARAM_DATASOURCE)) {
            model.put(PARAM_DATASOURCE, dataSource);
        }

        model.put(PARAM_USER, String.format("%s - %s", subject.username(), subject.nome()));
        model.put(PARAM_RESOURCE_BUNDLE, new ResourceBundle() {
            @Override
            protected Object handleGetObject(@NonNull String key) {
                return messages.getMessage(key);
            }
            @Override
            @NonNull
            public Enumeration<String> getKeys() {
                return Collections.enumeration(messages.getMessages().stringPropertyNames());
            }
        });

        if (format == ReportFormatEnum.XLS || format == ReportFormatEnum.CSV || format == ReportFormatEnum.XLSX) {
            model.put(PARAM_IS_IGNORE_PAGINATION, true);
        }
        model.put("format", format.toString());
        model.put(PARAM_LOGO, new ClassPathResource("reports/images/logo.png").getURL());

        return model;
    }

    private static void download(HttpServletResponse response, ReportFormatEnum format, JasperPrint print, String name) throws IOException, JRException {

        var exp = exportersFn.get(format);
        if(exp == null) {
            throw new IllegalArgumentException("O formato de exportação " + format + " não é reconhecido.");
        }

        var exporter = exp.apply(response.getOutputStream(), print);
        exporter.exportReport();

        response.setContentType(format.getMediaType());
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, String.format("attachment; filename=\"%s.%s\"", name, format.toString().toLowerCase()));
    }

    /**
     * Metodo para geracao de relatorios. Pode ser usado por metodos especificos para gerar relatorios especificos em URLs especificas.
     *
     * @param name  nome do relatorio a ser gerado (nome do arquivo .jrxml em src/main/resources/reports, sem a extensão)
     * @param model objeto por meio do qual os parametros sao passados para o view resolver.
     */
    @SneakyThrows
    public void generateReport(String name, Map<String, Object> model, JRDataSource dataSource, HttpServletResponse response, ReportFormatEnum format) {
        model = addParams(model, dataSource, format);

        InputStream report = getClass().getResourceAsStream("/reports/" + name + ".jasper");
        JasperPrint print = JasperFillManager.fillReport(report, model, dataSource);

        download(response, format, print, name);
    }
}
