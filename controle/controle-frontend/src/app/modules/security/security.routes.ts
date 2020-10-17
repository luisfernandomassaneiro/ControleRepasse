import { CarroManterComponent } from './components/carro/manter/carro-manter.component';
import { CarroService } from './services/carro.service';
import { CarroVisualizarComponent } from './components/carro/visualizar/carro-visualizar.component';
import { CarroListarComponent } from './components/carro/listar/carro-listar.component';

const ROUTES = [
  {
    path: 'carro',
    children: [
      {
        path: '',
        component: CarroListarComponent
      },
      {
        path: 'visualizar/:id',
        resolve: {
          entity: CarroService
        },
        component: CarroVisualizarComponent
      },
      {
        path: 'alterar/:id',
        resolve: {
          entity: CarroService
        },
        component: CarroManterComponent
      },
      {
        path: 'incluir',
        component: CarroManterComponent
      } ]
  }
];

export const SecurityRoutes = ROUTES;
