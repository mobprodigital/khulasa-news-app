import { Component } from '@angular/core';

import { Platform, MenuController, NavController, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { PostService } from './services/post/post.service';
import { ChooseLangComponent } from './shared/components/choose-lang/choose-lang.component';
import { LoaderService } from './services/loader/loader.service';

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
    private navCtrl: NavController,
    private loaderService: LoaderService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.getMenuCategories();
    });
  }

  private async getMenuCategories() {

    const lang: string = localStorage.getItem('lang');
    if (lang !== 'hin' && lang !== 'eng') {
      const v = await this.chooseLang();
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
          url: '/home',
          icon: '',
          id: 0,
          color: '#d33939'
        },
        {
          title: 'About Us',
          url: '/home',
          icon: '',
          id: 0,
          color: '#d33939'
        },
        {
          title: 'App Version',
          url: '/home',
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
    } else {
      this.navCtrl.navigateForward(['/home/archive', page.id]);
    }
  }

  private async chooseLang(): Promise<void> {

    const langModal = await this.modalCtrl.create({
      component: ChooseLangComponent,
      cssClass: 'lang-modal'
    });

    langModal.present().catch(err => alert(err));
    const data = await langModal.onDidDismiss();

    const choosedLang: string = data['data'];
    if (choosedLang && (choosedLang !== localStorage.getItem('lang'))) {
      localStorage.setItem('lang', choosedLang);
      this.loaderService.show();
      window.document.location.reload();
    }

    return Promise.resolve();

  }
}
