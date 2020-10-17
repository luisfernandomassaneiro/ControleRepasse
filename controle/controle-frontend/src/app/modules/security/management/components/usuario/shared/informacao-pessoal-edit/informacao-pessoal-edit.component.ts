import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { UsuarioModel } from '../../../../model/usuario.model';
import { SexoEnumDomainService } from '@shared/services/domain/security/sexo-enum-domain.service';
import {
  TipoUsuarioDomainService,
  TipoUsuarioEnum,
} from '@shared/services/domain/security/tipo-usuario-domain.service';
import { ReactiveFormsUtils } from '@shared/utils/reactive-forms.utils';
import { Subscription } from 'rxjs';
import { SystemSettingsService } from '@shared/services/system-settings.service';
import { ValidationService } from '@shared/services/validation.service';

@Component({
  selector: 'app-usuario-informacao-pessoal',
  templateUrl: './informacao-pessoal-edit.component.html',
})
export class InformacaoPessoalEditComponent implements OnInit {

  generos: string[] = [];
  tipos: string[] = [];
  form: FormGroup;
  edit: boolean;
  local = false;
  avatar: string;
  @Input() entity: UsuarioModel;
  @Output() save: EventEmitter<UsuarioModel> = new EventEmitter();
  @Input() backLabel = 'general.buttons.back';
  @Input() profileEdition: boolean;
  private readonly podeEditarUsername: boolean = true;
  private readonly podeEditarTipoUsuario: boolean = true;
  private subscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private tipoService: TipoUsuarioDomainService,
    sexoDomainService: SexoEnumDomainService,
    settings: SystemSettingsService,
  ) {
    sexoDomainService.list().subscribe(value => this.generos = value);
    this.podeEditarUsername = settings.settings.alterarUsername;
    this.podeEditarTipoUsuario = settings.settings.alterarTipoUsuario;
  }

  ngOnInit(): void {

    this.edit = !!this.entity.id;

    this.form = this.formBuilder.group({
      username: [this.entity.username, [Validators.required, Validators.maxLength(50)]],
      nome: [this.entity.nome, [Validators.required, Validators.maxLength(250)]],
      email: [this.entity.email, [Validators.required, Validators.maxLength(250), ValidationService.email]],
      tipoUsuario: [this.entity.tipoUsuario, [Validators.required]],
      sexo: [this.entity.sexo],
      nascimento: [this.entity.nascimento],
      active: [this.entity.active],
    });
    this.avatar = this.entity.avatar;

    this.updateValidations();

    this.local = this.entity.tipoUsuario === TipoUsuarioEnum.LOCAL.toString();
    this.subscription = this.form.get('tipoUsuario').valueChanges.subscribe(value => {
      const validators: ValidatorFn[] = [Validators.maxLength(250)];
      this.local = value === TipoUsuarioEnum.LOCAL.toString();
      if (this.local) {
        validators.push(Validators.required);
      }
      this.form.get('nome').setValidators(validators);
      this.updateValidations();
      this.form.get('nome').updateValueAndValidity();
    });

    this.tipoService.list().subscribe(value => {
      this.tipos = value;
      if (!this.entity.tipoUsuario) {
        this.form.get('tipoUsuario').setValue(value.length === 1 ? value[0] : TipoUsuarioEnum.LOCAL.toString());
      }
    });
  }

  saveInfo(formModel): void {

    if (!ReactiveFormsUtils.eval(this.form)) {
      return;
    }

    // Rollback dos valores que não podem ser alterados, só pra garantir.
    if (this.edit) {
      if (!this.podeEditarTipoUsuario) {
        formModel.tipoUsuario = this.entity.tipoUsuario;
      }
      if (!this.podeEditarUsername) {
        formModel.username = this.entity.username;
      }
      if (formModel.tipoUsuario !== TipoUsuarioEnum.LOCAL.toString()) {
        formModel.nome = this.entity.nome;
      }
    }

    this.entity = { ...this.entity, ...formModel };
    this.entity.avatar = this.avatar;
    this.save.emit(this.entity);
  }

  back() {
    history.go(-1);
  }

  private updateValidations(): void {
    if (this.edit) {
      if (!this.podeEditarUsername) {
        this.form.get('username').disable();
      }
      if (!this.podeEditarTipoUsuario) {
        this.form.get('tipoUsuario').disable();
      }
      if (this.form.get('tipoUsuario').value !== TipoUsuarioEnum.LOCAL.toString()) {
        this.form.get('nome').disable();
      }
    }
  }
}
