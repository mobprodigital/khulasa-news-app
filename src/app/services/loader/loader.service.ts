import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { LoadingOptions } from '@ionic/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private loader: HTMLIonLoadingElement;
  private loaderOptn: LoadingOptions = {
    keyboardClose: false,
    message: 'Please wait...'
  };

  constructor(
    private loadinCtrl: LoadingController
  ) { }


  public async show(options?: LoadingOptions) {
    try {
      this.loader = await this.loadinCtrl.create((options ? options : this.loaderOptn));
      await this.loader.present();
    } catch (err) {
      console.log('err in loading service : ', err);
    }
  }

  public async hide() {
    if (this.loader) {
      this.loader.dismiss();
    }
  }
}
