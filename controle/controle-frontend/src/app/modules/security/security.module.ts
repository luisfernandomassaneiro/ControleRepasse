import { CarroService } from './services/carro.service';
import { CarroManterComponent } from './components/carro/manter/carro-manter.component';
import { CarroFilterComponent } from './components/carro/listar/filter/carro-filter.component';
import { CarroVisualizarComponent } from './components/carro/visualizar/carro-visualizar.component';
import { CarroListarComponent } from './components/carro/listar/carro-listar.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { SecurityRoutes } from './security.routes';

@NgModule({
  declarations: [
    CarroListarComponent,
    CarroVisualizarComponent,
    CarroFilterComponent,
    CarroManterComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(SecurityRoutes)
  ],
  providers: [
    CarroService
  ],
  entryComponents: [
  ],
  exports: [
  ]
})
export class SecurityModule {}
