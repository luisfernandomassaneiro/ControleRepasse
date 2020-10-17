import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  NzAffixModule,
  NzAlertModule,
  NzAutocompleteModule,
  NzAvatarModule,
  NzBadgeModule,
  NzBreadCrumbModule,
  NzButtonModule,
  NzCalendarModule,
  NzCardModule,
  NzCarouselModule,
  NzCascaderModule,
  NzCheckboxModule,
  NzCollapseModule,
  NzCommentModule,
  NzDatePickerModule,
  NzDividerModule,
  NzDrawerModule,
  NzDropDownModule,
  NzEmptyModule,
  NzFormModule,
  NzGridModule,
  NzIconModule,
  NzInputModule,
  NzInputNumberModule,
  NzLayoutModule,
  NzListModule,
  NzMessageModule,
  NzModalModule,
  NzNotificationModule,
  NzProgressModule,
  NzRadioModule,
  NzResultModule,
  NzSelectModule,
  NzSkeletonModule,
  NzSliderModule,
  NzSpinModule,
  NzStepsModule,
  NzSwitchModule,
  NzTableModule,
  NzTabsModule,
  NzTagModule,
  NzToolTipModule,
  NzTransferModule,
  NzTreeModule,
  NzTreeSelectModule,
  NzUploadModule,
} from 'ng-zorro-antd';
import { ControlMessagesComponent } from '@shared/components/form/control-messages.component';
import { PageHeaderComponent } from '@shared/components/layout/page-header.component';
import { FilterComponent } from './components/filter/filter.component';
import { BooleanDisplayComponent } from './components/form/boolean-display.component';
import { ExportButtonComponent } from '@shared/components/form/export-button.component';
import { I18nLanguageSelectionComponent } from '@shared/configs/i18n/i18n.language-selection.component';
import { FilterFieldComponent } from '@shared/components/layout/filter-layout.component';
import { ListButtonsComponent } from '@shared/components/layout/list-buttons.component';
import { MultiSelectListComponent } from '@shared/components/form/multi-select-list/multi-select-list.component';
import { DatePickerComponent } from './components/form/date-picker/date-picker.component';
import { NgxMaskModule } from 'ngx-mask';
import { TextMaskModule } from 'angular2-text-mask';
import { NumberInputComponent } from './components/form/number-input/number-input.component';
import { TimePickerComponent } from './components/form/time-picker/time-picker.component';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { TimePickerValidationDirective } from '@shared/components/form/time-picker/time-picker-validation.directive';
import { FormItemComponent } from '@shared/components/form/form-item/form-item.component';
import { JoinPipe } from './pipes/join.pipe';
import { LazyListComponent } from '@shared/components/form/lazy-list/lazy-list.component';
import { CharacterCounterComponent } from './components/form/character-counter.component';
import { NzSpaceModule } from 'ng-zorro-antd/space';

const ZORROMODULES = [
  NzButtonModule,
  NzIconModule,
  NzGridModule,
  NzLayoutModule,
  NzSpaceModule,
  NzAffixModule,
  NzStepsModule,
  NzAutocompleteModule,
  NzCascaderModule,
  NzCheckboxModule,
  NzDatePickerModule,
  NzFormModule,
  NzInputModule,
  NzInputNumberModule,
  NzRadioModule,
  NzSelectModule,
  NzSliderModule,
  NzSwitchModule,
  NzTransferModule,
  NzTreeSelectModule,
  NzUploadModule,
  NzAvatarModule,
  NzBadgeModule,
  NzCalendarModule,
  NzCardModule,
  NzCarouselModule,
  NzCollapseModule,
  NzCommentModule,
  NzEmptyModule,
  NzListModule,
  NzTableModule,
  NzTabsModule,
  NzTagModule,
  NzToolTipModule,
  NzTreeModule,
  NzAlertModule,
  NzDrawerModule,
  NzMessageModule,
  NzModalModule,
  NzNotificationModule,
  NzProgressModule,
  NzResultModule,
  NzSkeletonModule,
  NzSpinModule,
  NzDividerModule,
  NzDropDownModule,
  NzBreadCrumbModule,
];

const THIRDMODULES = [
  TextMaskModule,
];
// #endregion

// #region your componets & directives
const COMPONENTS = [
  ControlMessagesComponent,
  PageHeaderComponent,
  FilterComponent,
  BooleanDisplayComponent,
  ExportButtonComponent,
  I18nLanguageSelectionComponent,
  FilterFieldComponent,
  ListButtonsComponent,
  MultiSelectListComponent,
  DatePickerComponent,
  NumberInputComponent,
  TimePickerComponent,
  FormItemComponent,
  LazyListComponent,
  CharacterCounterComponent,
];

const DIRECTIVES = [
  TimePickerValidationDirective,
];

// #endregion

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule,
    NgHttpLoaderModule.forRoot(),
    NgxMaskModule.forRoot({
      dropSpecialCharacters: false,
      validation: false,
    }),
    // third libs
    ...THIRDMODULES,
    ...ZORROMODULES,
  ],
  declarations: [
    // your components
    ...COMPONENTS,
    ...DIRECTIVES,
    JoinPipe,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    // i18n
    TranslateModule,
    // third libs
    ...THIRDMODULES,
    ...ZORROMODULES,
    // your components
    ...COMPONENTS,
    ...DIRECTIVES,
    NgxMaskModule,
    NgHttpLoaderModule,
    JoinPipe,
  ],
})
export class SharedModule {
}
