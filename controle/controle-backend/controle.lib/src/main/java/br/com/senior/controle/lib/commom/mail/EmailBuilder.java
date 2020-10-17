package br.com.senior.controle.lib.commom.mail;

import org.springframework.core.io.InputStreamSource;

import java.util.Map;

public interface EmailBuilder {
    EmailBuilder to(String to);
    EmailBuilder from(String from);
    EmailBuilder content(String content);
    EmailBuilder template(String template, Map<String, Object> params);
    EmailBuilder template(String template);
    EmailBuilder multipart(boolean multipart);
    EmailBuilder html(boolean html);
    EmailBuilder subject(String subject);

    EmailBuilder withAttachment(String name, InputStreamSource stream, String contentType);
    EmailBuilder withAttachment(String name, InputStreamSource stream);
    EmailBuilder withAttachment(String name, byte[] stream, String contentType);
    EmailBuilder withAttachment(String name, byte[] stream);

    void send();
    void sendSync();
}
