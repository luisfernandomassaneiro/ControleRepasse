import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { RouterModule } from '@angular/router';
import { SecurityRoutes } from './security.routes';
import { UsuarioService } from './services/usuario.service';
import { UsuarioFilterComponent } from './components/usuario/listar/usuario-filter/usuario-filter.component';
import { UsuarioVisualizarComponent } from './components/usuario/visualizar/usuario-visualizar.component';
import { UsuarioListarComponent } from './components/usuario/listar/usuario-listar.component';
import { UsuarioManterComponent } from './components/usuario/manter/usuario-manter.component';
import { AvatarComponent } from './components/usuario/shared/avatar/avatar.component';
import { UsuarioProfileComponent } from './components/profile/usuario-profile.component';
import { AlterarSenhaComponent } from './components/profile/alterar-senha/alterar-senha.component';
import { InformacaoPessoalEditComponent } from './components/usuario/shared/informacao-pessoal-edit/informacao-pessoal-edit.component';
import { CurrentService } from './services/current.service';

@NgModule({
  declarations: [
    UsuarioManterComponent,
    UsuarioListarComponent,
    AvatarComponent,
    UsuarioProfileComponent,
    AlterarSenhaComponent,
    UsuarioVisualizarComponent,
    UsuarioFilterComponent,
    InformacaoPessoalEditComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(SecurityRoutes),
  ],
  providers: [
    UsuarioService,
    CurrentService,
  ],
  entryComponents: [
    UsuarioManterComponent,
  ],
})
export class SecurityModule {
}
