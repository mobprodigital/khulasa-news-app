import { Component, OnInit, ViewChild } from '@angular/core';
import { PostService } from 'src/app/services/post/post.service';
import { PostModel } from 'src/app/models/post.model';
import { ModalController, MenuController, IonSlides } from '@ionic/angular';
import { SingleNewsComponent } from '../single-news/single-news.component';
import { PostCategoryModel } from 'src/app/models/post-category.model';


type catWisePost = {
  /**
   * Post category name
   */
  category: PostCategoryModel,
  /**
   * All posts of this category id
   */
  posts: PostModel[],
  loading: boolean
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
    private menuCtrl: MenuController,
  ) {
    // this.getCatId();
    this.getMenu();
  }

  private async getMenu() {
    try {
      const catList: PostCategoryModel[] = await this.postService.getMenuCategories();
      this.catPostList = <catWisePost[]>catList.map(cat => ({ category: cat, posts: [], loading: true }));
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
      const posts: PostModel[] = await this.postService.getPostArchive(categoryId, 10, 1);
      const targetCategory: catWisePost = this.catPostList.find(cat => cat.category.categoryId === categoryId);
      if (targetCategory) {
        targetCategory.posts = posts;
        targetCategory.loading = false;
      }
    } catch (err) { alert(err); }
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


  private getSlideIndex(index: number, offset: number, length: number): number {
    const num = index + offset;
    if (num > length - 1) {
      return length - 1;
    } else {
      return num;
    }
  }

  public async onSlideNext() {
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

  public async slideTo(targetIndex: number) {

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
}
