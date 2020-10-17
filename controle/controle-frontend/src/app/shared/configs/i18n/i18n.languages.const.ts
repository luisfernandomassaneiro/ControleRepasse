import ngEn from '@angular/common/locales/en';
import ngPt from '@angular/common/locales/pt';

import { en_US, pt_BR } from 'ng-zorro-antd';

import { LangData } from './i18n.lang-data.model';

export const DEFAULT_LANGUAGE = 'en';

export const DEFAULT_LANGUAGE_CONFIG = {
  abbr: 'pt-BR',
  text: 'Português',
  ng: ngPt,
  zorro: pt_BR,
  img: '/assets/img/flag-brazil.png',
};

export const LANGS: { [key: string]: LangData } = {
  en: {
    text: 'English',
    ng: ngEn,
    zorro: en_US,
    img: '/assets/img/flag-usa.png',
  },
  'pt-BR': DEFAULT_LANGUAGE_CONFIG,
};
