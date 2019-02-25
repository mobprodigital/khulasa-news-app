import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { LoadingOptions } from '@ionic/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  /** Returns true if loader is now visible else returns false */
  public isVisible: boolean = false;
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
      if (this.isVisible) {
        return;
      }
      this.loader = await this.loadinCtrl.create((options ? options : this.loaderOptn));
      await this.loader.present();
      this.isVisible = true;
    } catch (err) {
      this.isVisible = false;
      console.log('err in loading service : ', err);
    }
  }

  public async hide() {
    if (this.loader) {
      this.loader.dismiss().then(() => {
        this.isVisible = false;
      }).catch(err => this.isVisible = false);
    }
  }
}
