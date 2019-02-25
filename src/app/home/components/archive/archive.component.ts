import { Component, OnInit, ViewChild } from '@angular/core';
import { PostService } from 'src/app/services/post/post.service';
import { PostModel } from 'src/app/models/post.model';
import { ModalController, MenuController, IonSlides } from '@ionic/angular';
import { SingleNewsComponent } from '../single-news/single-news.component';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { PostCategoryModel } from 'src/app/models/post-category.model';


type catWisePost = {
  /**
   * Post category name
   */
  category: PostCategoryModel,
  /**
   * All posts of this category id
   */
  posts: PostModel[]
};

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss'],
})
export class ArchiveComponent implements OnInit {


  /** Category wise posts list */
  public catPostList: catWisePost[] = [];
  public activeTabIndex = 0;
  public postsList: PostModel[] = [];
  public menuCategories: PostCategoryModel[] = [];
  @ViewChild('postSlider') slider: IonSlides;

  constructor(
    private postService: PostService,
    private modelCtrl: ModalController,
    private loadingService: LoaderService,
    private menuCtrl: MenuController,
  ) {
    // this.getCatId();
    this.getMenu();
  }

  private async getMenu() {
    try {
      const catList: PostCategoryModel[] = await this.postService.getMenuCategories();
      this.catPostList = <catWisePost[]>catList.map(cat => ({ category: cat, posts: [] }));
      this.getPosts(catList[0].categoryId);
      this.getPosts(catList[1].categoryId);
      this.getPosts(catList[2].categoryId);
    } catch (err) {
      alert(err);
    }
  }

  public openMenu() {
    this.menuCtrl.open();
  }

  /**
   * Get posts by category id
   * @param categoryId category id
   */
  private async getPosts(categoryId?: number) {
    try {
      // this.loadingService.show();
      const posts: PostModel[] = await this.postService.getPostArchive(categoryId, 10, 1);
      const targetCategory: catWisePost = this.catPostList.find(cat => cat.category.categoryId === categoryId);
      if (targetCategory) {
        targetCategory.posts = posts;
      }

      // this.loadingService.hide();
    } catch (err) { alert(err); this.loadingService.hide(); }
  }

  ngOnInit() {

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


  public async onSlideNext() {
    const activeIndex = await this.slider.getActiveIndex();
    const targetCategory = this.catPostList[activeIndex + 2];
    if (targetCategory && targetCategory.posts && targetCategory.posts.length === 0) {
      this.getPosts(targetCategory.category.categoryId);
    }
    this.activeTabIndex = activeIndex;
  }

  public async onSlidePrev() {
    const activeIndex = await this.slider.getActiveIndex();
    this.activeTabIndex = activeIndex;
  }

  public slideTo() {
    this.slider.slideTo(this.activeTabIndex, 500);
    this.getPosts(this.catPostList[this.activeTabIndex].category.categoryId);
  }
}
