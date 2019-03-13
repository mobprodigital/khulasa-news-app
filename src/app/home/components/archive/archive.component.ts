import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { PostService } from 'src/app/services/post/post.service';
import { PostModel } from 'src/app/models/post.model';
import { ModalController, MenuController, IonSlides, Platform, IonSegment } from '@ionic/angular';
import { SingleNewsComponent } from '../single-news/single-news.component';
import { PostCategoryModel } from 'src/app/models/post-category.model';
import { SearchComponent } from 'src/app/shared/components/search/search.component';
import { AdMobFree } from '@ionic-native/admob-free/ngx';
import { RoutedEventEmitterService } from 'src/app/services/routed-event-emitter/routed-event-emitter.service';


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

  constructor(
    private postService: PostService,
    private modelCtrl: ModalController,
    private menuCtrl: MenuController,
    private adMob: AdMobFree,
    private platform: Platform,
    private routedEvtEmitter: RoutedEventEmitterService
  ) {

    this.platform.ready().then(() => {
      this.showAd();
    });

    this.getMenu();
    this.routedEvtEmitter.eventEmitter.subscribe(
      data => {
        if (data.data && data.data.catId) {
          this.setActiveTab(parseInt(data.data.catId, 10));
        }
      }
    );
  }


  private async showAd() {
    if (this.platform.is('cordova')) {


      this.adMob.banner.config({
        id: 'ca-app-pub-7769757158085259/7251294473',
        autoShow: true,
        isTesting: true,
      });

      this.adMob.banner.prepare()
        .then((msg) => console.log('archive page ad success', msg))
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



  public async viewPost(p: PostModel) {
    if (p) {
      const model = await this.modelCtrl.create({
        component: SingleNewsComponent,
        componentProps: {
          post: p
        }
      });
      model.present();
    }
  }


  private getSlideIndex(index: number, offset: number, length: number): number {
    const num = index + offset;
    if (num > length - 1) {
      return length - 1;
    } else {
      return num;
    }
  }


  public async onSlideNext(e: any) {
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
      const ele = this.catSegment['el'];
      const activeTab: HTMLElement = ele.querySelector('.segment-button-checked');
      const scrollCount = (activeTab.offsetLeft + (activeTab.clientWidth / 2)) - (ele.clientWidth / 2);
      ele.scrollTo({
        behavior: 'smooth',
        left: scrollCount
      });
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

    searchModal.present();
  }

}
