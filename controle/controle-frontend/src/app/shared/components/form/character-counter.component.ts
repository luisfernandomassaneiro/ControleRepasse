import { Component, Input, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslationService } from '@shared/services/translation.service';

@Component({
  selector: 'app-character-counter',
  template: `<span *ngIf="msg">{{ msg }}</span>`,
})
export class CharacterCounterComponent implements OnInit, OnDestroy {
  @Input() max: number;
  @Input() controlName: string;
  msg: string;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(@Optional() private form: FormGroupDirective, private translation: TranslationService) {
  }

  @Input()
  set value(val: string) {
    this.msg = null;
    if (val) {
      let chars = this.max - val.length;
      if (chars < 0) {
        chars = 0;
      }
      this.msg = this.translation.translate('general.labels.remaining_chars', { max: chars });
    }
  }

  ngOnInit() {
    if (this.form && this.controlName) {
      this.form.control.get(this.controlName).valueChanges.pipe(takeUntil(this.destroy$)).subscribe(v => {
        this.value = v;
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
