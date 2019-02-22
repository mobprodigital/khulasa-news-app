import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-choose-lang',
  templateUrl: './choose-lang.component.html',
  styleUrls: ['./choose-lang.component.scss']
})
export class ChooseLangComponent implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }


  public chooseLang(lang: 'hindi' | 'eng') {
    this.modalCtrl.dismiss(lang);
  }

}
