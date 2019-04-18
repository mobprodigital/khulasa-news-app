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
import { HttpClient, HttpParams } from '@angular/common/http';
import { CheckUpdateComponent } from './shared/components/check-update/check-update.component';
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
    private http: HttpClient,
    private modalCtrl: ModalController

  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      this.statusBar.show();
      this.splashScreen.hide();
      this.checkForUpdate();
      this.langService.OnLangChanged.subscribe(
        success => {
          console.log(success);
          this.getMenuCategories();
        }
      );

      this.getMenuCategories();
      if (this.platform.is('cordova')) {
        this.networkErrHandle();

        this.appVersion.getVersionNumber().then(versionCode => {
          this.appVersionNumber = versionCode.toString();
        });

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

    const activeLang: AppLanguageEnum | null = this.langService.selectedLang;

    if (activeLang !== null) {

    }

    this.postService.getMenuCategories().then(cats => {
      this.appPages.length = 0;

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

    }).catch(err => {
      if (confirm('Something went wrong. Try reload app')) {
        window.location.reload();
      }
    });
  }

  public closeMenu() {
    this.menuCtrl.close('main-menu');
  }

  public openPage(page: PageType) {

    this.routeEvtEmitter.sendMessage(page);

  }


  private isToday(someDate: Date): boolean {
    const today = new Date();
    return someDate.getDate() === today.getDate() &&
      someDate.getMonth() === today.getMonth() &&
      someDate.getFullYear() === today.getFullYear()
  }

  private async checkForUpdate() {


    const prevUpdateDate = localStorage.getItem('updateDate');
    if (prevUpdateDate) {
      const date: Date = new Date(prevUpdateDate);
      if (this.isToday(date)) {
        return;
      }
    }


    const packageName = await this.appVersion.getPackageName();
    this.http.get(
      'https://development.bdigimedia.com/riccha_dev/khulasa-News/getAdDetailsByAppName.php',
      {
        params: new HttpParams().set('appName', 'khulasa news').set('packageName', packageName.toString())
      }
    ).subscribe(
      async (resp: {
        appVersion: string,
        message: string,
        status: string
      }) => {
        if (resp.status === 'true') {
          const remoteAppversion = parseFloat(resp.appVersion);
          const currentAppVersion = await this.appVersion.getVersionNumber();
          const _currentAppVersion = parseFloat(currentAppVersion);
          if (remoteAppversion > _currentAppVersion) {
            const modal = await this.modalCtrl.create({
              component: CheckUpdateComponent,
              cssClass: 'update-modal',
              componentProps: {
                appVersion: remoteAppversion
              }

            });
            modal.present();
          }
        }
      },
      err => {
        console.log(err);
      },
      () => {
        localStorage.setItem('updateDate', new Date().toString());
      }
    );
  }


}
