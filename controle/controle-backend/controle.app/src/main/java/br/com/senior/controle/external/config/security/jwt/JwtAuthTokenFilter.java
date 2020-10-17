package br.com.senior.controle.external.config.security.jwt;

import br.com.senior.controle.external.config.security.model.CurrentUserInfo;
import br.com.senior.controle.lib.security.IUserContext;
import com.google.common.base.Strings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class JwtAuthTokenFilter extends OncePerRequestFilter {

    public static final String SPRING_SECURITY_PREFIX = "ROLE_";

    @Autowired
    private JwtProvider tokenProvider;
    @Autowired
    private IUserContext securityContext;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws ServletException, IOException {
        try {

            String jwt = getJwt(request);
            if (jwt != null && tokenProvider.validateJwtToken(jwt)) {

                var usr = securityContext.find(tokenProvider.getUser(jwt));
                if(usr != null) {

                    var info = new CurrentUserInfo(usr);
                    List<GrantedAuthority> auth = new ArrayList<>();
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(info, null, auth);
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        } catch (Exception e) {
            logger.error("Can NOT set user authentication", e);
        }
        filterChain.doFilter(request, response);
    }

    private static String getJwt(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if(!Strings.isNullOrEmpty(authHeader)) {
            if (authHeader.startsWith("Bearer ")) {
                return authHeader.replace("Bearer ", "");
            }
            return null;
        }

        return request.getParameter("token");
    }
}
