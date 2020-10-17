package br.com.senior.controle.external.config.security;

import br.com.senior.controle.external.config.security.jwt.JwtAuthEntryPoint;
import br.com.senior.controle.external.config.security.jwt.JwtAuthTokenFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(
        prePostEnabled = true,
        securedEnabled = true,
        jsr250Enabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    private final JwtAuthEntryPoint unauthorizedHandler;
    private final AuthProvider authProvider;
    private final JwtAuthTokenFilter jwtAuthTokenFilter;

    @Autowired
    public WebSecurityConfig(JwtAuthEntryPoint unauthorizedHandler, AuthProvider authProvider, JwtAuthTokenFilter jwtAuthTokenFilter) {
        this.unauthorizedHandler = unauthorizedHandler;
        this.authProvider = authProvider;
        this.jwtAuthTokenFilter = jwtAuthTokenFilter;
    }

    @Override
    public void configure(AuthenticationManagerBuilder authenticationManagerBuilder) {
        authenticationManagerBuilder.authenticationProvider(authProvider);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.cors().and().csrf().disable().
                authorizeRequests()
                .antMatchers("/api/auth/**", "/api/application/settings").permitAll()
                .anyRequest().authenticated().and()
                .exceptionHandling().authenticationEntryPoint(unauthorizedHandler).and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        http.addFilterBefore(jwtAuthTokenFilter, UsernamePasswordAuthenticationFilter.class);
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }
}
