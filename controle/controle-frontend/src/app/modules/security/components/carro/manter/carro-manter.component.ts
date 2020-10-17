import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ReactiveFormsUtils } from '@shared/utils/reactive-forms.utils';
import { ComparatorUtils } from '@shared/utils/comparator.utils';
import { BreadCrumbItem } from '@shared/components/layout/page-header.component';
import { ValidationService } from '@shared/services/validation.service';
import { CarroService } from '../../../services/carro.service';
import { CarroModel } from '../../../models/carro.model';
import { HashService } from '@shared/services/hash.service';

@Component({
  templateUrl: './carro-manter.component.html'
})
export class CarroManterComponent implements OnInit {

  comparator = ComparatorUtils.getInstance();
  entity: CarroModel;
  title: string;
  form: FormGroup;
  breadcrumb: BreadCrumbItem[] = [{label: 'menu.home', route: '/'}, {label: 'menu.security.carro', route: '/security/carro'}];

  constructor(
    private service: CarroService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private hash: HashService,
) {}

  ngOnInit(): void {


    this.entity = this.route.snapshot.data.entity || new CarroModel();
    if (this.entity.id) {
      this.title = 'security.carro.edit.title';
      this.breadcrumb.push({label: this.entity.descricao, route: ['../../visualizar/' + this.hash.encode(this.entity.id)]});
      this.breadcrumb.push({label: 'general.labels.edit'});
    } else {
      this.title = 'security.carro.add.title';
      this.breadcrumb.push({label: 'general.labels.add'});
    }

    this.form = this.formBuilder.group({
      id: [this.entity.id, []],
      descricao: [this.entity.descricao, [Validators.required, ]],
      placa: [this.entity.placa, []],
      renavam: [this.entity.renavam, []],
      vendedor: [this.entity.vendedor, []],
      comprador: [this.entity.comprador, []],
      valorCompra: [this.entity.valorCompra, []],
      valorVenda: [this.entity.valorVenda, []],
      data: [this.entity.data, []],
    });
  }

  save(model): void {
    if (!ReactiveFormsUtils.eval(this.form)) {
      return;
    }
    this.service.saveAndNotify(model, model.id).then(() => {
        history.go(-1);
    });
  }

  back() {
    history.go(-1);
  }
}
