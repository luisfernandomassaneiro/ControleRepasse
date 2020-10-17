import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UsuarioModel } from '../../../model/usuario.model';

import { BreadCrumbItem } from '@shared/components/layout/page-header.component';
import { UsuarioService } from '../../../services/usuario.service';
import { SystemSettingsService } from '@shared/services/system-settings.service';
import { HashService } from '@shared/services/hash.service';

@Component({
  selector: 'app-usuario-visualizar',
  templateUrl: './usuario-visualizar.component.html',
  styleUrls: ['./usuario-visualizar.component.scss'],
})
export class UsuarioVisualizarComponent implements OnInit {

  entity: UsuarioModel;
  breadcrumb: BreadCrumbItem[] = [{ label: 'menu.home', route: '/' }, {
    label: 'menu.security.usuario',
    route: '/security/usuario',
  }];
  multiType = true;

  constructor(
    private route: ActivatedRoute,
    private service: UsuarioService,
    private router: Router,
    settings: SystemSettingsService,
    public hash: HashService) {
    this.multiType = settings.multitype;
  }

  ngOnInit() {
    this.entity = this.route.snapshot.data.entity;
    this.breadcrumb.push({ label: this.entity.username });
  }

  delete(item): void {
    this.service.confirmAndDelete(item.id).then(() => this.router.navigate(['../../'], { relativeTo: this.route }));
  }
}
