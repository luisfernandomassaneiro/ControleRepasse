package br.com.senior.controle.lib.external.integration.rest;

import lombok.SneakyThrows;
import org.apache.http.config.Registry;
import org.apache.http.config.RegistryBuilder;
import org.apache.http.conn.socket.ConnectionSocketFactory;
import org.apache.http.conn.socket.PlainConnectionSocketFactory;
import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.TrustStrategy;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.impl.conn.BasicHttpClientConnectionManager;
import org.apache.http.ssl.SSLContexts;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import javax.net.ssl.SSLContext;
import java.util.function.Function;

@Component
public class RestClientFactory {

    private final RestTemplateBuilder builder;

    public RestClientFactory(RestTemplateBuilder builder) {
        this.builder = builder;
    }

    @SneakyThrows
    public <T> T template(boolean disableSSl, Function<RestTemplate, T> execute) {
        if (!disableSSl) {
            return execute.apply(builder.build());
        } else {
            TrustStrategy acceptingTrustStrategy = (cert, authType) -> true;
            SSLContext sslContext = SSLContexts.custom().loadTrustMaterial(null, acceptingTrustStrategy).build();
            SSLConnectionSocketFactory sslsf = new SSLConnectionSocketFactory(sslContext,
                    NoopHostnameVerifier.INSTANCE);

            Registry<ConnectionSocketFactory> socketFactoryRegistry =
                    RegistryBuilder.<ConnectionSocketFactory>create()
                            .register("https", sslsf)
                            .register("http", new PlainConnectionSocketFactory())
                            .build();

            try(var connectionManager = new BasicHttpClientConnectionManager(socketFactoryRegistry);
                var httpClient = HttpClients.custom().setSSLSocketFactory(sslsf).setConnectionManager(connectionManager).build()) {
                if(httpClient == null) {
                    throw new IllegalArgumentException("Não foi possível instanciar o Cliente HTTP");
                }
                HttpComponentsClientHttpRequestFactory requestFactory =
                        new HttpComponentsClientHttpRequestFactory(httpClient);
                return execute.apply(new RestTemplate(requestFactory));
            }
        }
    }
}
