import { Component } from '@angular/core';
import { Platform, MenuController, ToastController, ModalController } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { PostService } from './services/post/post.service';
import { AppLanguageEnum } from './interfaces/app-lang.enum';
import { AppLangService } from './services/choose-lang/choose-lang.service';
import { RoutedEventEmitterService } from './services/routed-event-emitter/routed-event-emitter.service';
import { PageType } from './interfaces/page.interface';
import { AppVersion } from '@ionic-native/app-version/ngx';

import { FcmService } from './services/fcm/fcm.service';
import { Device } from '@ionic-native/device/ngx';
import { AjaxService } from './services/ajax/ajax.service';
import { PostModel } from './models/post.model';
import { SingleNewsComponent } from './home/components/single-news/single-news.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  public appVersionNumber: string = '0.0.1';

  public iconsArr: {
    eng: string[],
    hin: string[]
  } = {
      eng: [
        'news.png',
        'politics.png',
        'world.png',
        'business.png',
        'sports.png',
        'video.png',
        'lifestyle.png',
        'entartain.png',
        'bazaar_review.png',
        'language.png',
      ],
      hin: [
        'news.png',
        'politics.png',
        'world.png',
        'punjab.png',
        'up.png',
        'business.png',
        'sports.png',
        'video.png',
        'lifestyle.png',
        'entartain.png',
        'bazaar_review.png',
        'language.png',
      ]
    };
  public appPages: PageType[] = [];


  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private postService: PostService,
    private menuCtrl: MenuController,
    private langService: AppLangService,
    private routeEvtEmitter: RoutedEventEmitterService,
    private network: Network,
    private tost: ToastController,
    private appVersion: AppVersion,
    private fcm: FcmService,
    private device: Device,
    private ajax: AjaxService,
    private modelCtrl: ModalController,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      this.statusBar.show();
      this.splashScreen.hide();
      this.getMenuCategories();
      if (this.platform.is('cordova')) {
        this.networkErrHandle();
        this.appVersion.getVersionCode().then(versionCode => {
          this.appVersionNumber = versionCode.toString();
        });
        // this.notificationSetup();
      }
    });
  }


  /* private async presentToast(message) {
    const toast = await this.tost.create({
      message: message.body,
      duration: 3000,
    });
    toast.present();
  }
 */
  /*  private async viewPost(post: PostModel) {
 
     const model = await this.modelCtrl.create({
       component: SingleNewsComponent,
       componentProps: {
         post: post
       }
     });
     //  model.onDidDismiss().finally(() => {
     //   this.postClosed.emit();
     // });
     // model.present().then(p => {
     //   this.postViewed.emit();
     // }).catch(err => {
     //   console.log('error : ', err);
     // }); 
   } */


  /* private notificationSetup() {
    this.fcm.getToken();
    this.fcm.onTockenRefresh().subscribe(
      async token => {
        console.log('token changed : ', token);
        const appVer = await this.appVersion.getVersionNumber();
        const dataToSend = {
          'deviceId': this.device.uuid,
          'deviceName': this.device.model,
          'appVer': appVer,
          'fcmToken': token
        };
        this.ajax.post(dataToSend, 'http://development.bdigimedia.com/riccha_dev/khulasa-News/pushNotifications/setFcmToken.php'
        ).catch(err => {

        });
      },
      err => {
        console.log('notification error : ', err);
      }
    );
    this.fcm.onNotifications().subscribe(
      notification => {
        console.log('notification success : ', notification);
        if (this.platform.is('ios')) {
          this.presentToast(notification.aps.alert);
        } else {
          if (notification && notification.tap) {
            const postSlug: string = notification.url;
            if (postSlug) {
              this.postService.getPost(postSlug).then(post => {
                if (post) {
                  this.viewPost(post);
                }
              });
            }
          } else {
            this.presentToast(notification);
          }
        }
      },
      err => {
        console.log('notification err : ', err);
      }
    );
  } */

  private async networkErrHandle() {
    this.network.onDisconnect().subscribe(async () => {
      const t = await this.tost.create({
        message: 'Internet disconnected',
        duration: 2000,
        color: 'danger',
        position: 'top'
      });
      t.present();
    });

    this.network.onConnect().subscribe(async () => {
      const t = await this.tost.create({
        message: 'Internet connected',
        duration: 2000,
        color: 'success',
        position: 'top'
      });

      t.present();
    });
  }

  private async getMenuCategories() {

    const activeLang: AppLanguageEnum = this.langService.selectedLang;

    this.postService.getMenuCategories().then(cats => {
      this.appPages.push(...cats.map((c, i) => ({
        title: c.categoryName,
        url: 'home',
        id: c.categoryId,
        icon: activeLang === AppLanguageEnum.English ? this.iconsArr.eng[i] : this.iconsArr.hin[i]
      })));
      this.appPages.push(...[
        {
          title: 'Choose language',
          url: 'lang',
          icon: (activeLang === AppLanguageEnum.English) ?
            this.iconsArr.eng[this.iconsArr.eng.length - 1] : this.iconsArr.hin[this.iconsArr.hin.length - 1],
          id: 0
        },
        {
          title: 'Contact Us',
          url: 'contact_us',
          icon: '',
          id: 76,
          color: '#d33939'
        },
        {
          title: 'About Us',
          url: 'about_us',
          icon: '',
          id: 71,
          color: '#d33939'
        },
        {
          title: 'Privacy Policy',
          url: 'privacy_policy',
          icon: '',
          id: 3,
          color: '#d33939'
        },
      ]);

    });
  }

  public closeMenu() {
    this.menuCtrl.close('main-menu');
  }

  public openPage(page: PageType) {

    this.routeEvtEmitter.sendMessage(page);

  }

}
