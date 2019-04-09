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
        this.registerAppmetrica();
      }
    });
  }

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


  private registerAppmetrica() {
    document.addEventListener('deviceready', () => {
      var configuration = {
        // Mandatory
        apiKey: 'a8a6ee78-cf5f-4f07-9b21-0d92437237bd',
        // Optional
        trackLocationEnabled: true,
        handleFirstActivationAsUpdateEnabled: true,
        sessionTimeout: 15
      };

      try {

        (<any>window).appMetrica.activate(configuration);
        (<any>window).appMetrica.reportEvent('Test event', { 'foo': 'bar' });
      } catch (err) {
        console.log('App metrica err : ', err);
      }
    }, false);
  }

}
