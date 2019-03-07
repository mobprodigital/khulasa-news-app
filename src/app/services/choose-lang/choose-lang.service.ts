import { Injectable } from '@angular/core';
import { AppLanguageEnum } from 'src/app/interfaces/app-lang.enum';

@Injectable({
  providedIn: 'root'
})
export class AppLangService {



  constructor() {
    this.setDefaultLang();
  }

  private _selectedLang: AppLanguageEnum;

  public get selectedLang(): AppLanguageEnum {
    return this._selectedLang;
  }
  public set selectedLang(v: AppLanguageEnum) {
    localStorage.setItem('lang', v);
    this._selectedLang = v;
  }

  private setDefaultLang() {
    const savedLang = (localStorage.getItem('lang') === AppLanguageEnum.Hindi) ? AppLanguageEnum.Hindi : AppLanguageEnum.English;
    localStorage.setItem('lang', savedLang);
    this._selectedLang = savedLang;
  }




}
