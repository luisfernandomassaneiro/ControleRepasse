import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadCrumbItem } from '@shared/components/layout/page-header.component';
import { CarroModel } from '../../../models/carro.model';
import { CarroService } from '../../../services/carro.service';
import { HashService } from '@shared/services/hash.service';

@Component({
  templateUrl: './carro-visualizar.component.html'
})
export class CarroVisualizarComponent implements OnInit {

  entity: CarroModel;
  breadcrumb: BreadCrumbItem[] = [{label: 'menu.home', route: '/'},
    {label: 'menu.security.carro', route: '/security/carro'}];

  constructor(private route: ActivatedRoute, private router: Router, private service: CarroService, public hash: HashService) { }

  ngOnInit() {
    this.entity = this.route.snapshot.data.entity;
    if (this.entity.descricao) {
      this.breadcrumb.push({label: this.entity.descricao});
    } else {
      this.breadcrumb.push({label: 'general.labels.view'});
    }
  }

    delete(item): void {
      this.service.confirmAndDelete(item.id).then(() => this.router.navigate(['../../'], { relativeTo: this.route }));
    }
}
