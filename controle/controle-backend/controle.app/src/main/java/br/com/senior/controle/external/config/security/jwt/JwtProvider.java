package br.com.senior.controle.external.config.security.jwt;

import br.com.senior.controle.lib.commom.settings.SecuritySettings;
import io.jsonwebtoken.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.concurrent.TimeUnit;

@Slf4j
@Component
public class JwtProvider {

    private static final String ROLE_KEY = "role";

    private final SecuritySettings settings;

    public JwtProvider(SecuritySettings settings) {
        this.settings = settings;
    }

    public String generateJwtToken(Long user, Long role) {
        var builder = Jwts.builder()
                .setSubject(user.toString());
        if(role != null) {
            builder.claim(ROLE_KEY, role);
        }
        return builder.setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + TimeUnit.DAYS.toMillis(365)))
                .signWith(SignatureAlgorithm.HS512, settings.getJwtSecret())
                .compact();
    }

    boolean validateJwtToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(settings.getJwtSecret()).parseClaimsJws(authToken);
            return true;
        } catch (SignatureException e) {
            log.error("Invalid JWT signature -> Message: {0} ", e);
        } catch (MalformedJwtException e) {
            log.error("Invalid JWT token -> Message: {0}", e);
        } catch (ExpiredJwtException e) {
            log.error("Expired JWT token -> Message: {0}", e);
        } catch (UnsupportedJwtException e) {
            log.error("Unsupported JWT token -> Message: {0}", e);
        } catch (IllegalArgumentException e) {
            log.error("JWT claims string is empty -> Message: {0}", e);
        }
        return false;
    }

    private Claims claims(String token) {
        return Jwts.parser()
                .setSigningKey(settings.getJwtSecret())
                .parseClaimsJws(token)
                .getBody();
    }

    Long getUser(String token) {
        String subject = claims(token).getSubject();
        return Long.parseLong(subject);
    }

    Long getRole(String token) {
        return claims(token).get(ROLE_KEY, Long.class);
    }
}
