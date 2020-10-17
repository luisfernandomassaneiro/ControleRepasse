package br.com.senior.controle.external.config;

import liquibase.integration.spring.SpringLiquibase;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class LiquibaseConfig {

    @Setter
    @Value("${org.liquibase.change_log}")
    private String config;

    @Bean
    public SpringLiquibase liquibase(DataSource dataSource) {
        SpringLiquibase liquibase = new SpringLiquibase();
        liquibase.setChangeLog("classpath:db/" + config);
        liquibase.setDataSource(dataSource);
        return liquibase;
    }
}
