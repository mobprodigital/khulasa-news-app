import { Component } from '@angular/core';
import { Platform, MenuController, ModalController, ToastController } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { PostService } from './services/post/post.service';
import { ChooseLangComponent } from './shared/components/choose-lang/choose-lang.component';
import { LoaderService } from './services/loader/loader.service';
import { SingalPageComponent } from './shared/components/singal-page/singal-page.component';
import { AppLanguageEnum } from './interfaces/app-lang.enum';
import { AppLangService } from './services/choose-lang/choose-lang.service';
import { RoutedEventEmitterService } from './services/routed-event-emitter/routed-event-emitter.service';

interface PageType {
  title: string;
  url: string;
  id: number;
  icon?: string;
  color?: string;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

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
    private modalCtrl: ModalController,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private postService: PostService,
    private menuCtrl: MenuController,
    private loaderService: LoaderService,
    private langService: AppLangService,
    private routeEvtEmitter: RoutedEventEmitterService,
    private network: Network,
    private tost: ToastController,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.show();
      this.splashScreen.hide();
      this.getMenuCategories();
      if (this.platform.is('cordova')) {
        this.networkErrHandle();
        this.initFbAnalitics();
      }
    });
  }

 

  private async initFbAnalitics() {
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

    const lang: string = localStorage.getItem('lang_choosen');
    if (lang !== 'true') {
      const v = await this.chooseLang();
      localStorage.setItem('lang_choosen', 'true');
    }

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
    if (page.url === 'lang') {
      this.chooseLang();
    } else if (page.url === 'about_us' || page.url === 'contact_us' || page.url === 'privacy_policy') {
      this.showPageModal({ pageId: page.id, pageTitle: page.title });
    } else {
      this.routeEvtEmitter.sendMessage({
        catId: page.id
      });
    }
  }

  private async showPageModal(params: object): Promise<void> {
    const pageModal = await this.modalCtrl.create({
      component: SingalPageComponent,
      componentProps: params
    });
    pageModal.present();
  }

  private async chooseLang(): Promise<void> {

    const langModal = await this.modalCtrl.create({
      component: ChooseLangComponent,
      cssClass: 'lang-modal'
    });

    langModal.present().catch(err => alert(err));
    const data = await langModal.onDidDismiss();

    const choosedLang: AppLanguageEnum = data['data'];
    if (choosedLang && choosedLang !== this.langService.selectedLang) {
      this.langService.selectedLang = choosedLang;
      this.loaderService.show();
      window.document.location.reload();
    }

    return Promise.resolve();

  }

}
