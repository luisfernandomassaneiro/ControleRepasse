package br.com.senior.controle;

import br.com.senior.controle.lib.external.persistence.CustomRepositoryFactoryBean;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@EnableCaching
@SpringBootApplication
@EnableConfigurationProperties
@EnableJpaRepositories(repositoryFactoryBeanClass = CustomRepositoryFactoryBean.class)
public class MainApplication {
	public static void main(String[] args) {
		SpringApplication.run(MainApplication.class, args);
	}
}
