import { Component, OnInit, ViewChild } from '@angular/core';
import { PostModel } from 'src/app/models/post.model';
import { PostService } from 'src/app/services/post/post.service';
import { NavParams, ModalController, IonSlides, } from '@ionic/angular';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { PostCategoryModel } from 'src/app/models/post-category.model';

interface SliderPostType {
  post: PostModel;
  relatedPosts: PostModel[];
  isVideo?: boolean;
}

@Component({
  selector: 'app-single-news',
  templateUrl: './single-news.component.html',
  styleUrls: ['./single-news.component.scss']
})
export class SingleNewsComponent implements OnInit {

  /** List of ids whos prev post is fetched */
  private postFetchedList: Set<number> = new Set();
  public youTubeUrl: SafeResourceUrl;
  public isVideoPost = false;
  public sliderPosts: SliderPostType[] = [];
  @ViewChild('postSlider') slider: IonSlides;


  public sliderOptions: any = {
    loop: false
  };
  constructor(
    private postService: PostService,
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private domSanitizer: DomSanitizer,
  ) {
  }

  ngOnInit() {
    this.getNewsId();
  }

  private async getNewsId() {
    const postData = <PostModel>this.navParams.get('post');
    if (postData) {
      this.sliderPosts.push({
        post: postData,
        relatedPosts: null,
        isVideo: postData.categoryList.some(c => c.categoryId === 47)
      });
      this.postService.getRelatedPosts(postData.postId).then(rp => {
        this.sliderPosts[0].relatedPosts = rp;
      });
      try {
        const postData1 = await this.getNextPost(postData.postId);
        this.sliderPosts.push(postData1);
        this.postFetchedList.add(postData.postId);

        const postData2 = await this.getNextPost(postData1.post.postId);
        this.sliderPosts.push(postData2);
        this.postFetchedList.add(postData1.post.postId);

      } catch (err) {
        alert(err);
      }
    }
  }


  /**
   * get youtube yotube url from content string
   * @param iframeString html string
   */
  public geturl(iframeString: string): SafeResourceUrl | null {
    const tempDiv: HTMLDivElement = document.createElement('div');
    tempDiv.innerHTML = iframeString;
    const ytIframe: HTMLIFrameElement = tempDiv.querySelector('iframe');
    if (ytIframe) {
      return this.domSanitizer.bypassSecurityTrustResourceUrl(ytIframe.src);
    } else {
      return null;
    }

  }

  public goBack() {
    this.modalCtrl.dismiss();
  }

  public sharePost(ev: MouseEvent, post: PostModel) {
    ev.stopPropagation();

    if ('share' in navigator) {
      window.navigator['share']({
        title: post.title,
        text: post.content.substr(0, 100),
        url: post.portalUrl
      }).catch(err => { });
    } else {
      alert('share api is not supported in your device');
    }
  }

  public async onSlideNext() {
    const activeIndex = await this.slider.getActiveIndex();
    if (activeIndex !== null && activeIndex !== undefined && (activeIndex >= this.sliderPosts.length - 3)) {
      const lastPost = this.sliderPosts[this.sliderPosts.length - 1];
      if (lastPost) {

        /**
       * check if next post is already fetched
       */
        const isAlReadyExist: boolean = this.postFetchedList.has(lastPost.post.postId);
        if (isAlReadyExist) {
          return;
        }

        this.postFetchedList.add(lastPost.post.postId);

        const nextPost = await this.getNextPost(lastPost.post.postId);
        if (nextPost) {
          this.sliderPosts.push(nextPost);
        }
      }
    }
  }

  public async getNextPost(postId: number): Promise<SliderPostType> {
    try {
      const nextPostPromise = await Promise.all(
        [
          this.postService.getAdjecentPost(postId, 'previous', 'full', 'true'),
          this.postService.getRelatedPosts(postId)
        ])
        .catch(err => undefined);
      if (nextPostPromise && nextPostPromise[0] && nextPostPromise[1]) {
        const nextPost: SliderPostType = {
          post: nextPostPromise[0],
          relatedPosts: nextPostPromise[1],
          isVideo: nextPostPromise[0].categoryList.some((cat: PostCategoryModel) => cat.categoryId === 47)
        };
        return nextPost;
      } else {
        return null;
      }

    } catch (err) {
      throw err;
    }
  }

}
