import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-check-update',
  templateUrl: './check-update.component.html',
  styleUrls: ['./check-update.component.scss']
})
export class CheckUpdateComponent implements OnInit {

  public remoteVersion: string = '1.1';

  constructor(
    private modalCtrl: ModalController,
    
    private navParams: NavParams,

  ) { }

  ngOnInit() {
    this.remoteVersion = this.navParams.get('appVersion');
  }

  public async update() {
    const packageName = 'com.mojodigi.khulasanews';
    try {
      window.open(`market://details?id=${packageName}`, '_system', 'location=yes');
    } catch (err) {
      window.open(`https://play.google.com/store/apps/details?id=${packageName}`, '_system', 'location=yes');
    }
  }

  public goback() {
    this.modalCtrl.dismiss();
  }
}
