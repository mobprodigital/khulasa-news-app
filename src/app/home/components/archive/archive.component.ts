import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { PostService } from 'src/app/services/post/post.service';
import { PostModel } from 'src/app/models/post.model';
import { ModalController, MenuController, IonSlides, Platform, IonSegment, ToastController, AlertController } from '@ionic/angular';
import { PostCategoryModel } from 'src/app/models/post-category.model';
import { AdMobFree } from '@ionic-native/admob-free/ngx';
import { RoutedEventEmitterService } from 'src/app/services/routed-event-emitter/routed-event-emitter.service';
import { PageType } from 'src/app/interfaces/page.interface';
import { ChooseLangComponent } from 'src/app/shared/components/choose-lang/choose-lang.component';
import { AppLanguageEnum } from 'src/app/interfaces/app-lang.enum';
import { AppLangService } from 'src/app/services/choose-lang/choose-lang.service';
import { SingalPageComponent } from 'src/app/shared/components/singal-page/singal-page.component';
import { IDeepLinkObject } from 'src/app/interfaces/deeplink-object.interface';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { SingleNewsComponent } from '../single-news/single-news.component';

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
    private deeplinks: Deeplinks,
    private modalCtrl: ModalController
  ) {

    this.platform.ready().then(async () => {


      // this.showAd();

      this.langService.OnLangChanged.subscribe(
        success => {
          this.getMenu().then(() => {
            this.setActiveTab();
          });
        }
      );

      if (this.langService.selectedLang === null) {
        this.chooseLang();
      } else {
        this.getMenu();
      }





      if (this.platform.is('cordova')) {
        this.manageDeepLnks();
      }

    });



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

  private async chooseLang(): Promise<AppLanguageEnum> {

    const langModal = await this.modelCtrl.create({
      component: ChooseLangComponent,
      cssClass: 'lang-modal',
      backdropDismiss: false
    });

    langModal.present().catch(err => console.log('err : ', err)).finally(() => {
      this.exitAppSetting('preset');
    });
    const data = await langModal.onDidDismiss().finally(() => {
      this.exitAppSetting('reset');
    });

    const choosedLang: AppLanguageEnum = data['data'];

    return Promise.resolve(choosedLang);


    /* if (choosedLang && choosedLang !== this.langService.selectedLang) {
      // this.langService.selectedLang = choosedLang;
      // window.document.location.reload();
      return Promise.resolve(choosedLang);
    } else {
      return Promise.reject('Error in choose language');
    } */


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

      this.adMob.on(this.adMob.events.BANNER_CLOSE).subscribe(
        success => {
          console.log('ev BANNER_CLOSE success ', success);
        },
        err => {
          console.log('ev BANNER_CLOSE err ', err);
        }
      );

      this.adMob.on(this.adMob.events.BANNER_EXIT_APP).subscribe(
        success => {
          console.log('ev BANNER_EXIT_APP success ', success);
        },
        err => {
          console.log('ev BANNER_EXIT_APP err ', err);
        }
      );

      this.adMob.on(this.adMob.events.BANNER_LOAD).subscribe(
        success => {
          console.log('ev BANNER_LOAD success ', success);
        },
        err => {
          console.log('ev BANNER_LOAD err ', err);
        }
      );

      this.adMob.on(this.adMob.events.BANNER_LOAD_FAIL).subscribe(
        success => {
          console.log('ev BANNER_LOAD_FAIL success ', success);
        },
        err => {
          console.log('ev BANNER_LOAD_FAIL err ', err);
        }
      );

      this.adMob.on(this.adMob.events.BANNER_OPEN).subscribe(
        success => {
          console.log('ev BANNER_OPEN success ', success);
        },
        err => {
          console.log('ev BANNER_OPEN err ', err);
        }
      );


      this.adMob.banner.config({
        id: 'ca-app-pub-7769757158085259/7251294473',
        autoShow: true,
        isTesting: false,
      });
      this.adMob.banner.prepare()
        .then(() => {
          this.adMob.banner.show().catch(err => {
            console.log('err in show ad : ', err);
          });
        })
        .catch(err => console.error('archive page ad failed ', err));
    }
  }

  private async getMenu() {
    try {
      this.catPostList.length = 0;

      const catList: PostCategoryModel[] = await this.postService.getMenuCategories();

      this.catPostList = <CatWisePost[]>catList.map(cat => (<CatWisePost>{
        category: cat,
        posts: [],
        loading: true,
        nextPostLoading: false
      }));

      await Promise.all(
        [
          this.getPosts(catList[0].categoryId),
          this.getPosts(catList[1].categoryId),
          this.getPosts(catList[2].categoryId)
        ]
      ).catch(() => undefined);

      return Promise.resolve();

    } catch (err) {
      if (confirm('Something went wrong. Try reload app')) {
        window.location.reload();
      }
    }
  }

  private async setActiveTab(catId?: number): Promise<void> {
    if (catId) {

      for (let i = 0; i < this.catPostList.length; i++) {
        if (this.catPostList[i].category.categoryId === catId) {
          this.activeTabIndex = i;
          this.slideTo(i);
          break;
        }
      }
    } else {
      this.activeTabIndex = 0;
      this.slideTo(0);
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
    console.log('ngOnInit');

  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit');
    this.platform.resume.subscribe(
      () => {
        this.manageDeepLnks();

      }
    );
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
              window.open('com.google.android.webview', '_self', 'location=no');
            }
          }]
        });
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


  private manageDeepLnks() {
    this.deeplinks.route({
    }).subscribe(
      success => {
        console.log('deep link success : ', success);
      },
      (err: IDeepLinkObject) => {
        console.log('deep link err : ', err);
        if (err.$link && err.$link.path) {
          const pathArr = err.$link.path.split('/');
          console.log('pathArr : ', pathArr);
          if (pathArr && pathArr.length > 0) {
            const postSlug: string = pathArr[1];
            let langRecieved: AppLanguageEnum;

            if (AppLanguageEnum.English === pathArr[2]) {
              langRecieved = AppLanguageEnum.English;
            } else if (AppLanguageEnum.Hindi === pathArr[2]) {
              langRecieved = AppLanguageEnum.Hindi;
            } else {
              return;
            }

            this.langService.selectedLang = langRecieved;

            this.postService.getPost(postSlug).then(async postShared => {
              if (postShared) {
                const modal = await this.modalCtrl.create({
                  component: SingleNewsComponent,
                  componentProps: {
                    post: postShared
                  }
                });

                modal.present();
              }
            }).catch(err => console.log('post shared err : ', err));
          }
        }
      },
      () => {
        console.log('deeplink complete');
      }
    );
  }

}
