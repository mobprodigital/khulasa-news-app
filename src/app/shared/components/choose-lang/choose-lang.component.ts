import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AppLangService } from 'src/app/services/choose-lang/choose-lang.service';
import { AppLanguageEnum } from 'src/app/interfaces/app-lang.enum';

@Component({
  selector: 'app-choose-lang',
  templateUrl: './choose-lang.component.html',
  styleUrls: ['./choose-lang.component.scss']
})
export class ChooseLangComponent implements OnInit {

  constructor(private modalCtrl: ModalController, private appLangService: AppLangService) { }

  ngOnInit() {
  }


  public chooseLang(lang: string) {
    const _lang: AppLanguageEnum = lang === AppLanguageEnum.Hindi ? AppLanguageEnum.Hindi : AppLanguageEnum.English;
    this.modalCtrl.dismiss(_lang);
  }

}
