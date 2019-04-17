import { Injectable, Output, EventEmitter } from '@angular/core';
import { AppLanguageEnum } from 'src/app/interfaces/app-lang.enum';

@Injectable({
  providedIn: 'root'
})
export class AppLangService {

  @Output()
  public OnLangChanged: EventEmitter<AppLanguageEnum> = new EventEmitter();


  constructor() {
  }

  public get selectedLang(): AppLanguageEnum {
    const _lang = localStorage.getItem('lang');
    if (_lang === AppLanguageEnum.English) {
      return AppLanguageEnum.English;
    } else if (_lang === AppLanguageEnum.Hindi) {
      return AppLanguageEnum.Hindi;
    } else {
      return null;
    }
  }
  public set selectedLang(v: AppLanguageEnum) {
    const _lang = localStorage.getItem('lang');
    if (_lang !== v) {
      localStorage.setItem('lang', v);
      this.OnLangChanged.emit(v);
    }
  }


}
