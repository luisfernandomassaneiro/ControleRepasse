package br.com.senior.controle.lib.external.integration.mail;

import br.com.senior.controle.lib.commom.mail.EmailBuilder;
import br.com.senior.controle.lib.commom.mail.EmailService;
import br.com.senior.controle.lib.commom.settings.ApplicationSettings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.thymeleaf.spring5.SpringTemplateEngine;

import java.util.Map;

@Component
public class EmailServiceImpl implements EmailService {

    private final SpringTemplateEngine templateEngine;
    private final EmailSender javaMailSender;
    private final ApplicationSettings settings;

    @Autowired
    public EmailServiceImpl(SpringTemplateEngine templateEngine, EmailSender javaMailSender, ApplicationSettings settings) {
        this.templateEngine = templateEngine;
        this.javaMailSender = javaMailSender;
        this.settings = settings;
    }

    @Override
    public void sendEmail(String to, String subject, String content, boolean isHtml) {
        builder().content(content).to(to).subject(subject).html(isHtml).send();
    }

    @Override
    public void sendEmailFromTemplate(String to, String subject, String templateName, Map<String, Object> templateParams) {
        builder().template(templateName, templateParams).to(to).subject(subject).send();
    }

    @Override
    public EmailBuilder builder() {
        return new EmailBuilderImpl(templateEngine, javaMailSender, settings.getUrl());
    }
}
