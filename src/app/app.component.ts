import { Component } from '@angular/core';
import { Platform, MenuController, NavController, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { PostService } from './services/post/post.service';
import { ChooseLangComponent } from './shared/components/choose-lang/choose-lang.component';
import { LoaderService } from './services/loader/loader.service';
import { SingalPageComponent } from './shared/components/singal-page/singal-page.component';
import { AppLanguageEnum } from './interfaces/app-lang.enum';
import { AppLangService } from './services/choose-lang/choose-lang.service';
import { Router } from '@angular/router';
import { RoutedEventEmitterService } from './services/routed-event-emitter/routed-event-emitter.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {



  public iconsArr: string[] = [
    'home.png',
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
  ];
  public appPages: [{
    title: string,
    url: string,
    id: number
    icon?: string,
    color?: string
  }] = [
      {
        title: 'Home',
        url: '/home',
        icon: this.iconsArr[0],
        id: 0
      }
    ];

  constructor(
    private modalCtrl: ModalController,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private postService: PostService,
    private menuCtrl: MenuController,
    private loaderService: LoaderService,
    private langService: AppLangService,
    private routeEvtEmitter: RoutedEventEmitterService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.show();
      this.splashScreen.hide();
      this.getMenuCategories();
    });


  }

  private async getMenuCategories() {

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
        icon: this.iconsArr[i + 1]
      })));
      this.appPages.push(...[
        {
          title: 'Choose language',
          url: 'lang',
          icon: this.iconsArr[this.iconsArr.length - 1],
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
          title: 'App Version',
          url: '/verion',
          icon: '',
          id: 0,
          color: '#d33939'
        },
      ]);

    });
  }

  public closeMenu() {
    this.menuCtrl.close('main-menu');
  }

  public openPage(page: any) {
    if (page.url === 'lang') {
      this.chooseLang();
    } else if (page.url === 'about_us' || page.url === 'contact_us') {
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
