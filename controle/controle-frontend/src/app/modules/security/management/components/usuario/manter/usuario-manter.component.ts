import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { UsuarioService } from '../../../services/usuario.service';
import { UsuarioModel } from '../../../model/usuario.model';

import { BreadCrumbItem } from '@shared/components/layout/page-header.component';
import { HashService } from '@shared/services/hash.service';

@Component({
  selector: 'app-usuario-manter',
  templateUrl: './usuario-manter.component.html',
  styleUrls: ['./usuario-manter.component.css'],
})
export class UsuarioManterComponent implements OnInit {

  entity: UsuarioModel;
  title: string;
  breadcrumb: BreadCrumbItem[] = [{ label: 'menu.home', route: '/' }, {
    label: 'menu.security.usuario',
    route: '/security/usuario',
  }];
  edicao: boolean;

  constructor(
    private service: UsuarioService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private hash: HashService) {
  }

  ini(): void {
    this.breadcrumb = [{ label: 'menu.home', route: '/' }, {
      label: 'menu.security.usuario',
      route: '/security/usuario',
    }];
    this.edicao = !!this.entity.id;
    if (this.entity.username) {
      this.title = 'security.usuario.edit.title';
      this.breadcrumb.push({
        label: this.entity.username,
        route: ['../../visualizar/' + this.hash.encode(this.entity.id)],
      });
      this.breadcrumb.push({ label: 'general.labels.edit' });
    } else {
      this.title = 'security.usuario.add.title';
      this.breadcrumb.push({ label: 'general.labels.add' });
    }
  }

  ngOnInit(): void {
    this.entity = this.route.snapshot.data.entity || new UsuarioModel();
    this.ini();
  }

  save(model: UsuarioModel): void {
    if (this.edicao) {
      this.service.updateUser(model, this.entity.id).then(() => {
      });
    } else {
      this.service.saveUser(model).then((next) => {
        this.entity = next;
        this.ini();
      });
    }
  }
}
