package br.com.senior.controle.external.config.security.endpoints;

import br.com.senior.controle.business.application.auth.dto.ValidadeTokenDto;
import br.com.senior.controle.business.application.auth.usecase.UcAlterarSenhaPorToken;
import br.com.senior.controle.business.application.auth.usecase.UcRecuperarSenha;
import br.com.senior.controle.business.application.auth.usecase.UcVerficarToken;
import br.com.senior.controle.business.application.security.usuario.dto.UsuarioDto;
import br.com.senior.controle.business.application.security.usuario.usecase.UcObterUsuario;
import br.com.senior.controle.external.config.security.jwt.JwtProvider;
import br.com.senior.controle.external.config.security.jwt.JwtResponse;
import br.com.senior.controle.external.config.security.model.CurrentUserInfo;
import br.com.senior.controle.external.config.security.model.LoginRequest;
import br.com.senior.controle.external.config.security.model.SubjectDto;
import br.com.senior.controle.lib.business.application.usecase.UseCaseFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtProvider jwtProvider;
    private final UseCaseFacade facade;

    @Autowired
    public AuthController(AuthenticationManager authenticationManager, JwtProvider jwtProvider, UseCaseFacade facade) {
        this.authenticationManager = authenticationManager;
        this.jwtProvider = jwtProvider;
        this.facade = facade;
    }

    private SubjectDto create(CurrentUserInfo principle){
        UsuarioDto user = facade.execute(new UcObterUsuario().withId(principle.getUser().getId()));
        SubjectDto subject = new SubjectDto(principle);
        subject.setAvatar(user.getAvatar());
        return subject;
    }

    @GetMapping("subject")
    public ResponseEntity<SubjectDto> getSubject() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        if (principal instanceof CurrentUserInfo) {
            CurrentUserInfo principle = (CurrentUserInfo) principal;
            return ResponseEntity.ok(create(principle));
        }
        return ResponseEntity.ok(new SubjectDto());
    }

    @PostMapping("/signin")
    public ResponseEntity<JwtResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        CurrentUserInfo principal = (CurrentUserInfo) authentication.getPrincipal();
        Long role = null;
        String jwt = jwtProvider.generateJwtToken(principal.getUser().getId(), role);
        return ResponseEntity.ok(new JwtResponse(jwt, create(principal)));
    }

    @PostMapping("/recover")
    public ResponseEntity<ValidadeTokenDto> recuperarSenha(@RequestBody UcRecuperarSenha model) {
        return ResponseEntity.ok(facade.execute(model));
    }

    @PostMapping("/change-by-token")
    public ResponseEntity<Boolean> alterarSenhaPorToken(@RequestBody UcAlterarSenhaPorToken model) {
        facade.execute(model);
        return ResponseEntity.ok(true);
    }

    @GetMapping("/check-token/{token}")
    public ResponseEntity<ValidadeTokenDto> checkToken(@PathVariable String token) {
        return ResponseEntity.ok(facade.execute(new UcVerficarToken(token)));
    }
}
