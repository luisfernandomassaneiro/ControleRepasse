package br.com.senior.controle.lib.external.integration.mail;

import br.com.senior.controle.lib.commom.mail.EmailBuilder;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.core.io.InputStreamSource;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;

import java.io.ByteArrayInputStream;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

class EmailBuilderImpl implements EmailBuilder {

    private final MailData data = new MailData();
    private final SpringTemplateEngine templateEngine;
    private final EmailSender javaMailSender;
    private final String baseUrl;

    EmailBuilderImpl(SpringTemplateEngine templateEngine, EmailSender javaMailSender, String baseUrl) {
        this.templateEngine = templateEngine;
        this.javaMailSender = javaMailSender;
        this.baseUrl = baseUrl;
    }

    @Override
    public EmailBuilder to(String to) {
        data.setTo(to);
        return this;
    }

    @Override
    public EmailBuilder from(String from) {
        data.setFrom(from);
        return this;
    }

    @Override
    public EmailBuilder content(String content) {
        data.setContent(content);
        return this;
    }

    @Override
    public EmailBuilder template(String template, Map<String, Object> params) {

        if(params == null){
            params = new HashMap<>();
        }

        params.put("app_url", baseUrl);
        Locale locale = LocaleContextHolder.getLocale();
        Context context = new Context(locale);
        params.forEach(context::setVariable);

        data.setContent(templateEngine.process(template, context));
        data.setHtml(true);
        return this;
    }

    @Override
    public EmailBuilder template(String template) {
        return this.template(template, null);
    }

    @Override
    public EmailBuilder multipart(boolean multipart) {
        data.setMultipart(multipart);
        return this;
    }

    @Override
    public EmailBuilder html(boolean html) {
        data.setHtml(html);
        return this;
    }

    @Override
    public EmailBuilder subject(String subject) {
        this.data.setSubject(subject);
        return this;
    }

    @Override
    public EmailBuilder withAttachment(String name, InputStreamSource stream, String contentType) {
        data.getAttachments().add(new MailData.Attachment(name, stream, contentType));
        return this;
    }

    @Override
    public EmailBuilder withAttachment(String name, InputStreamSource stream) {
        return withAttachment(name, stream, null);
    }

    @Override
    public EmailBuilder withAttachment(String name, byte[] stream, String contentType) {
        data.getAttachments().add(new MailData.Attachment(name, () -> new ByteArrayInputStream(stream), contentType));
        return this;
    }

    @Override
    public EmailBuilder withAttachment(String name, byte[] stream) {
        return this.withAttachment(name, stream, null);
    }

    @Override
    public void send() {
        data.validate();
        javaMailSender.send(data);
    }

    @Override
    public void sendSync() {
        data.validate();
        javaMailSender.sendSync(data);
    }
}
