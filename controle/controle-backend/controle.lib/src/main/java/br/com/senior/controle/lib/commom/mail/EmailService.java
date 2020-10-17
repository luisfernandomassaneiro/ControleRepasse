package br.com.senior.controle.lib.commom.mail;

import java.util.Map;

public interface EmailService {
    void sendEmail(String to, String subject, String content, boolean isHtml);
    void sendEmailFromTemplate(String to, String subject, String templateName, Map<String, Object> templateParams);
    EmailBuilder builder();
}
