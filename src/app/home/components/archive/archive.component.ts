import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { PostService } from 'src/app/services/post/post.service';
import { PostModel } from 'src/app/models/post.model';
import { ModalController, MenuController, IonSlides, Platform, IonSegment, ToastController, AlertController } from '@ionic/angular';
import { PostCategoryModel } from 'src/app/models/post-category.model';
import { SearchComponent } from 'src/app/shared/components/search/search.component';
import { AdMobFree } from '@ionic-native/admob-free/ngx';
import { RoutedEventEmitterService } from 'src/app/services/routed-event-emitter/routed-event-emitter.service';
import { PageType } from 'src/app/interfaces/page.interface';
import { ChooseLangComponent } from 'src/app/shared/components/choose-lang/choose-lang.component';
import { AppLanguageEnum } from 'src/app/interfaces/app-lang.enum';
import { AppLangService } from 'src/app/services/choose-lang/choose-lang.service';
import { SingalPageComponent } from 'src/app/shared/components/singal-page/singal-page.component';
import { Market } from '@ionic-native/market/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { FcmService } from 'src/app/services/fcm/fcm.service';
import { AjaxService } from 'src/app/services/ajax/ajax.service';
import { SingleNewsComponent } from '../single-news/single-news.component';
import { Device } from '@ionic-native/device/ngx';

type CatWisePost = {
  /**
   * Post category name
   */
  category: PostCategoryModel,
  /**
   * All posts of this category id
   */
  posts: PostModel[],
  /**
   * Show inital loader
   */
  loading: boolean,
  /**
   * Show loader while next posts are fethcing
   */
  nextPostLoading: boolean,
  errMessage: string
};

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss'],
})
export class ArchiveComponent implements OnInit, AfterViewInit {


  /** Category wise posts list */
  public catPostList: CatWisePost[] = [];
  public activeTabIndex = 0;
  public postsList: PostModel[] = [];
  public menuCategories: PostCategoryModel[] = [];
  @ViewChild('catSegment') catSegment: IonSegment;

  @ViewChild('postSlider') slider: IonSlides;

  /** sroll timer */
  private scrollTimer: any;

  private canAppExit = true;
  private backBtnCounter = 0;
  private modalCounter = 0;

  constructor(
    private postService: PostService,
    private modelCtrl: ModalController,
    private menuCtrl: MenuController,
    private adMob: AdMobFree,
    private platform: Platform,
    private routedEvtEmitter: RoutedEventEmitterService,
    private toastCtrl: ToastController,
    private langService: AppLangService,
    private alertCtrl: AlertController,
    private market: Market,
    private tost: ToastController,
    private appVersion: AppVersion,
    private fcm: FcmService,
    private device: Device,
    private ajax: AjaxService,
  ) {

    this.platform.ready().then(async () => {
      this.showAd();
      const lang: string = localStorage.getItem('lang_choosen');
      if (lang !== 'true') {
        const v = await this.chooseLang();
        localStorage.setItem('lang_choosen', 'true');
      }

      if (this.platform.is('android')) {
        // this.notificationSetup();
      }

    });

    this.getMenu();
    this.routedEvtEmitter.eventEmitter.subscribe(
      params => {
        const pageData: PageType = params.data;
        if (pageData) {
          if (pageData.url === 'lang') {
            this.chooseLang();
          } else if (pageData.url === 'about_us' || pageData.url === 'contact_us' || pageData.url === 'privacy_policy') {
            this.showPageModal({ pageId: pageData.id, pageTitle: pageData.title });
          } else {
            this.setActiveTab(pageData.id);
          }
        }
      }
    );

    if ('app' in navigator) {
      this.exitOnbackBtn();
    }

  }

  private async chooseLang(): Promise<void> {

    const langModal = await this.modelCtrl.create({
      component: ChooseLangComponent,
      cssClass: 'lang-modal'
    });

    langModal.present().catch(err => console.log('err : ', err)).finally(() => {
      this.exitAppSetting('preset');
    });
    const data = await langModal.onDidDismiss().finally(() => {
      this.exitAppSetting('reset');
    });

    const choosedLang: AppLanguageEnum = data['data'];
    if (choosedLang && choosedLang !== this.langService.selectedLang) {
      this.langService.selectedLang = choosedLang;
      window.document.location.reload();
    }

    return Promise.resolve();

  }

  private async showPageModal(params: object): Promise<void> {
    const pageModal = await this.modelCtrl.create({
      component: SingalPageComponent,
      componentProps: params
    });

    pageModal.onDidDismiss().finally(() => {
      this.exitAppSetting('reset');
    });

    pageModal.present().finally(() => {
      this.exitAppSetting('preset');
    });
  }

  private async exitOnbackBtn() {

    this.platform.backButton.subscribeWithPriority(1, async () => {
      if (this.canAppExit) {
        if (this.backBtnCounter === 0) {
          const toast = await this.toastCtrl.create({
            message: 'Press back again to exit',
            closeButtonText: '',
            position: 'bottom',
            duration: 3000
          });

          toast.present().finally(() => {
            this.backBtnCounter++;
          });

        } else {
          navigator['app'].exitApp();
        }
      }

    });
  }


  private async showAd() {
    if (this.platform.is('cordova')) {
      this.adMob.banner.config({
        id: 'ca-app-pub-7769757158085259/7251294473',
        autoShow: true,
        isTesting: false,
      });
      this.adMob.banner.prepare()
        .then((msg) => {
          this.adMob.banner.show();
        })
        .catch(err => console.error('archive page ad failed ', err));
    }
  }

  private async getMenu() {
    try {
      const catList: PostCategoryModel[] = await this.postService.getMenuCategories();
      this.catPostList = <CatWisePost[]>catList.map(cat => (<CatWisePost>{
        category: cat,
        posts: [],
        loading: true,
        nextPostLoading: false
      }));

      this.getPosts(catList[0].categoryId);
      this.getPosts(catList[1].categoryId);
      this.getPosts(catList[2].categoryId);

    } catch (err) {
      alert(err);
    }
  }

  private async setActiveTab(catId: number): Promise<void> {
    if (catId) {
      for (let i = 0; i < this.catPostList.length; i++) {
        if (this.catPostList[i].category.categoryId === catId) {
          this.activeTabIndex = i;
          this.slideTo(i);
          break;
        }
      }
    }
  }

  public openMenu() {
    this.menuCtrl.open();
  }

  /**
   * Get posts by category id
   * @param categoryId category id
   */
  private async getPosts(categoryId?: number, from: number = 1, count: number = 10) {
    const targetCategory: CatWisePost = this.catPostList.find(cat => cat.category.categoryId === categoryId);

    targetCategory.errMessage = null;
    try {
      const posts: PostModel[] = await this.postService.getPostArchive(categoryId, count, from);
      if (targetCategory && posts.length > 0) {
        targetCategory.posts.push(...posts);
        targetCategory.loading = false;
        targetCategory.nextPostLoading = false;
      }
    } catch (err) {
      targetCategory.loading = false;
      targetCategory.nextPostLoading = false;
      targetCategory.errMessage = err;
    }
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
  }


  public exitAppSetting(action: 'reset' | 'preset') {
    this.modalCounter = (action === 'preset') ? ++this.modalCounter : --this.modalCounter;
    this.backBtnCounter = 0;
    this.canAppExit = (action === 'reset') && (this.modalCounter <= 0);
  }


  private getSlideIndex(index: number, offset: number, length: number): number {
    const num = index + offset;
    if (num > length - 1) {
      return length - 1;
    } else {
      return num;
    }
  }


  public async onSlideNext(_e: any) {
    const activeIndex = await this.slider.getActiveIndex();
    const slidesCount = await this.slider.length();
    const targetIndex = this.getSlideIndex(activeIndex, 2, slidesCount);
    const targetCategory = this.catPostList[targetIndex];
    if (targetCategory && targetCategory.posts && targetCategory.posts.length === 0) {
      targetCategory.loading = true;
      this.getPosts(targetCategory.category.categoryId);
    }
    this.activeTabIndex = activeIndex;
  }

  public async onSlidePrev() {
    const activeIndex = await this.slider.getActiveIndex();
    const targetCategory = this.catPostList[activeIndex];
    if (targetCategory && targetCategory.posts && targetCategory.posts.length === 0) {
      targetCategory.loading = true;
      this.getPosts(targetCategory.category.categoryId);
    }
    this.activeTabIndex = activeIndex;
  }

  /**
   * Slide to target index number
   * @param targetIndex Target slide index number
   */
  public async slideTo(targetIndex: number) {
    this.scrollSegmentTo();
    this.slider.slideTo(targetIndex, 500, false);
    const targetCategory = this.catPostList[targetIndex];
    if (targetCategory && targetCategory.posts && targetCategory.posts.length === 0) {
      targetCategory.loading = true;

      this.getPosts(targetCategory.category.categoryId);
    }
    if (targetIndex < await this.slider.length()) {
      const targetCategoryNext = this.catPostList[targetIndex + 1];
      if (targetCategoryNext && targetCategoryNext.posts && targetCategoryNext.posts.length === 0) {
        targetCategoryNext.loading = true;
        this.getPosts(targetCategoryNext.category.categoryId);
      }
    }

  }




  public async scrollSegmentTo() {
    if (this.scrollTimer) {
      window.clearTimeout(this.scrollTimer);
    }
    this.scrollTimer = setTimeout(() => {
      try {

        const ele = this.catSegment['el'];
        if (ele) {
          const activeTab: HTMLElement = ele.querySelector('.segment-button-checked');
          const scrollCount = (activeTab.offsetLeft + (activeTab.clientWidth / 2)) - (ele.clientWidth / 2);
          if (!ele['scrollTo']) {
            throw new Error('Webview outdated');
          }
          ele.scrollTo({
            behavior: 'smooth',
            left: scrollCount
          });
        }
      } catch (err) {
        this.alertCtrl.create({
          message: 'Looks like you are using older version of webview. Please go to play store and update your Android System WebView',
          buttons: [{
            text: 'Open play store',
            handler: () => {
              this.market.open('com.google.android.webview').catch(err => {
                alert('Unable to search for Android System WebView. Go to playstore and update yourself');
              });
            }
          }]
        })
      }
    }, 100);

  }

  /**
   * load more posts
   */
  public async loadMore(category: CatWisePost) {
    if (category) {
      category.nextPostLoading = true;
      this.getPosts(category.category.categoryId, category.posts.length + 1);
    }
  }

  public async onScroll(e: Event, category: CatWisePost) {
    const target: HTMLElement = <HTMLElement>e.target;
    if ((target.scrollTop >= (target.scrollHeight - 1000)) && !category.nextPostLoading) {
      this.loadMore(category);
    }
  }

  public async openSearch() {
    const searchModal = await this.modelCtrl.create({
      component: SearchComponent,
      id: 'search-model'
    });

    searchModal.onDidDismiss().finally(() => {
      this.exitAppSetting('reset');
    });
    searchModal.present().finally(() => {
      this.exitAppSetting('preset');
    });
  }


  private notificationSetup() {
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
  }

  private async presentToast(message) {
    const toast = await this.tost.create({
      message: message.body,
      duration: 3000,
    });
    toast.present();
  }

  private async viewPost(post: PostModel) {

    const model = await this.modelCtrl.create({
      component: SingleNewsComponent,
      componentProps: {
        post: post
      }
    });
    /* model.onDidDismiss().finally(() => {
      this.postClosed.emit();
    });
    model.present().then(p => {
      this.postViewed.emit();
    }).catch(err => {
      console.log('error : ', err);
    }); */
  }


}
