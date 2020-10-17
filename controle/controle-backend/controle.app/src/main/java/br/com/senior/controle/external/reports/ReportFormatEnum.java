package br.com.senior.controle.external.reports;

import lombok.Getter;

public enum ReportFormatEnum {
    CSV("text/csv"),
    HTML("text/html"),
    PDF("application/pdf"),
    XLSX("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"),
    ODS("application/vnd.oasis.opendocument.spreadsheet"),
    XLS("application/vnd.ms-excel");

    @Getter
    private final String mediaType;

    ReportFormatEnum(String mediaType) {
        this.mediaType = mediaType;
    }
}
