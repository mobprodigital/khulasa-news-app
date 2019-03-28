import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase/ngx';
import { Platform } from '@ionic/angular';
import { Device } from '@ionic-native/device/ngx';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  constructor(
    private firebase: Firebase,
    private afs: AngularFirestore,
    private platform: Platform,
    private device: Device,
  ) { }

  async getToken() {
    let token;
    if (this.platform.is('android')) {
      token = await this.firebase.getToken();
    }

    if (this.platform.is('ios')) {
      token = await this.firebase.getToken();
      await this.firebase.grantPermission();
    }
    this.saveToken(token);
    return token;
  }

  private saveToken(token) {
    if (!token) return;

    const devicesRef = this.afs.collection('devices');

    const data = {
      token,
      'deviceId': this.device.uuid,
      'deviceName': this.device.model,
    };

    return devicesRef.doc(token).set(data);
  }

  public onNotifications() {
    return this.firebase.onNotificationOpen();
  }

  public onTockenRefresh() {
    return this.firebase.onTokenRefresh();
  }

}
