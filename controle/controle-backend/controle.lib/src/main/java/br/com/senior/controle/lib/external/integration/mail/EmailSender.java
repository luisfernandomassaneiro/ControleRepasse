package br.com.senior.controle.lib.external.integration.mail;

import com.google.common.base.Strings;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import javax.mail.internet.MimeMessage;
import java.nio.charset.StandardCharsets;

@Slf4j
@Component
public class EmailSender {

    @Value("${spring.mail.from}")
    private String defaultFrom;

    private final JavaMailSender javaMailSender;

    @Autowired
    public EmailSender(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    @SneakyThrows
    private MimeMessage createMessage(MailData data) {

        boolean multipart = data.isMultipart();
        if (data.getAttachments() != null && !data.getAttachments().isEmpty()) {
            multipart = true;
        }

        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper message = new MimeMessageHelper(mimeMessage, multipart, StandardCharsets.UTF_8.name());
        message.setTo(data.getTo());
        message.setSubject(data.getSubject());
        message.setText(data.getContent(), data.isHtml());

        if (Strings.isNullOrEmpty(data.getFrom())) {
            message.setFrom(defaultFrom);
        } else {
            message.setFrom(data.getFrom());
        }

        for (MailData.Attachment attachment : data.getAttachments()) {
            if (Strings.isNullOrEmpty(attachment.getType())) {
                message.addAttachment(attachment.getName(), attachment.getStream());
            } else {
                message.addAttachment(attachment.getName(), attachment.getStream(), attachment.getType());
            }
        }
        return mimeMessage;
    }

    @Async
    public void send(MailData data) {
        try {
            MimeMessage mimeMessage = createMessage(data);
            javaMailSender.send(mimeMessage);
            log.debug("Sent email to User '{}'", data.getTo());
        } catch (Exception e) {
            if (log.isDebugEnabled()) {
                log.warn("Email could not be sent to user '{}'", data.getTo(), e);
            } else {
                log.warn("Email could not be sent to user '{}': {}", data.getTo(), e.getMessage());
            }
        }
    }

    public void sendSync(MailData data) {
        MimeMessage mimeMessage = createMessage(data);
        javaMailSender.send(mimeMessage);
        log.debug("Sent email to User '{}'", data.getTo());
    }
}
