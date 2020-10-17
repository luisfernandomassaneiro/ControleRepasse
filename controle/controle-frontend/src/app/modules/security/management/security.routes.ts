import { UsuarioService } from './services/usuario.service';
import { UsuarioListarComponent } from './components/usuario/listar/usuario-listar.component';
import { UsuarioManterComponent } from './components/usuario/manter/usuario-manter.component';
import { UsuarioProfileComponent } from './components/profile/usuario-profile.component';
import { UsuarioVisualizarComponent } from './components/usuario/visualizar/usuario-visualizar.component';
import { CurrentService } from './services/current.service';

const ROUTES = [
  {
    path: 'usuario',
    children: [
      {
        path: 'listar',
        component: UsuarioListarComponent,
      },
      {
        path: 'profile',
        component: UsuarioProfileComponent,
        resolve: {
          entity: CurrentService,
        },
      },
      {
        path: 'visualizar/:id',
        component: UsuarioVisualizarComponent,
        resolve: {
          entity: UsuarioService,
        },
      },
      {
        path: 'alterar/:id',
        component: UsuarioManterComponent,
        resolve: {
          entity: UsuarioService,
        },
      },
      {
        path: 'incluir',
        component: UsuarioManterComponent,
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'listar',
      },
    ],
  },
];
export const SecurityRoutes = ROUTES;

