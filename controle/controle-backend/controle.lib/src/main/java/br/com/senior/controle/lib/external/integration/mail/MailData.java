package br.com.senior.controle.lib.external.integration.mail;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.apache.commons.lang3.StringUtils;
import org.springframework.core.io.InputStreamSource;

import java.util.ArrayList;
import java.util.List;

@Data
class MailData {

    @Data
    @AllArgsConstructor
    static
    class Attachment {
        private String name;
        private InputStreamSource stream;
        private String type;
    }

    private String to;
    private String from;
    private String subject;
    private String content;
    private boolean multipart;
    private boolean html;
    private List<Attachment> attachments = new ArrayList<>();

    void validate(){
        if(StringUtils.isBlank(to)){
            throw new IllegalArgumentException("O Campo Destinatário não foi informado na mensagem do Email");
        }
    }
}