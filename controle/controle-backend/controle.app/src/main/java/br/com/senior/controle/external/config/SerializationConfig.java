package br.com.senior.controle.external.config;

import br.com.senior.controle.lib.external.serialization.DateFormatter;
import br.com.senior.controle.lib.external.serialization.EmptyOrBlankStringAsNullDeserializer;
import br.com.senior.controle.lib.external.serialization.LocalDateFormatter;
import br.com.senior.controle.lib.external.serialization.LocalDateTimeFormatter;
import com.fasterxml.jackson.databind.module.SimpleModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.format.datetime.standard.DateTimeFormatterRegistrar;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.annotation.PostConstruct;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.TimeZone;

@Configuration
public class SerializationConfig implements WebMvcConfigurer {

    @Bean
    SimpleModule customSerializersModule() {
        SimpleModule module = new SimpleModule();
        module.addDeserializer(String.class, new EmptyOrBlankStringAsNullDeserializer());
        module.addSerializer(LocalDate.class, new LocalDateFormatter());
        module.addSerializer(LocalDateTime.class, new LocalDateTimeFormatter());
        module.addSerializer(Date.class, new DateFormatter());
        return module;
    }

    @Override
    public void addFormatters(FormatterRegistry registry) {
        DateTimeFormatterRegistrar registrar = new DateTimeFormatterRegistrar();
        registrar.setUseIsoFormat(true);
        registrar.registerFormatters(registry);

        registry.addFormatterForFieldType(Date.class, new DateFormatter());
        registry.addFormatterForFieldType(LocalDate.class, new LocalDateFormatter());
        registry.addFormatterForFieldType(LocalDateTime.class, new LocalDateTimeFormatter());
    }

    @PostConstruct
    public void init(){
        // Setting Spring Boot SetTimeZone
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
    }
}
