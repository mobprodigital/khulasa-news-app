import { Component, OnInit, ViewChild } from '@angular/core';
import { PostModel } from 'src/app/models/post.model';
import { PostService } from 'src/app/services/post/post.service';
import { NavParams, ModalController, IonSlides, Platform, } from '@ionic/angular';
import { AdMobFree } from '@ionic-native/admob-free/ngx';

interface SliderPostType {
  post: PostModel;
  relatedPosts: PostModel[];
  // isVideo?: boolean;
}

@Component({
  selector: 'app-single-news',
  templateUrl: './single-news.component.html',
  styleUrls: ['./single-news.component.scss']
})
export class SingleNewsComponent implements OnInit {

  /** List of ids whos prev post is fetched */
  private postFetchedList: Set<number> = new Set();
  public sliderPosts: SliderPostType[] = [];
  @ViewChild('postSlider') slider: IonSlides;


  public sliderOptions: any = {
    loop: false
  };
  constructor(
    private postService: PostService,
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private adMob: AdMobFree,
    private platform: Platform,
  ) {
    platform.ready().then(() => {
      this.showAd();
    });
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
        console.error(err);
      }
    }
  }


  public goBack() {
    this.modalCtrl.dismiss();
  }

  public async sharePost() {

    if ('share' in navigator) {
      const postIndex = await this.slider.getActiveIndex();
      const post = this.sliderPosts[postIndex].post;

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
    this.stopVideo(activeIndex - 1);
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

  public async onSlidePrev() {
    const activeIndex = await this.slider.getActiveIndex();
    this.stopVideo(activeIndex + 1);
  }

  /**
   * Stop currently playing youtube video
   * @param targetIndex terget slider index
   */
  private async stopVideo(targetIndex: number): Promise<void> {
    if (this.sliderPosts[targetIndex].post.isVideoPost) {
      const slides = this.slider['el'];
      if (slides) {
        const swipeWrapper = slides.querySelector('.swiper-wrapper');
        if (swipeWrapper) {
          const targetSlide = swipeWrapper.children[targetIndex];
          if (targetSlide) {
            const iframe = targetSlide.querySelector('iframe');
            if (iframe) {
              const iframeSrc = iframe.src;
              iframe.src = iframeSrc;
            }
          }
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
        };
        return nextPost;
      } else {
        return null;
      }

    } catch (err) {
      throw err;
    }
  }

  public async viewPost(p: PostModel) {
    if (p) {
      this.slider.getActiveIndex().then(activeIndex => this.stopVideo(activeIndex));
      const model = await this.modalCtrl.create({
        component: SingleNewsComponent,
        componentProps: {
          post: p
        }
      });
      model.present();
    }
  }

  private async showAd() {
    return;
    if (this.platform.is('cordova')) {
      this.adMob.interstitial.config({
        id: 'ca-app-pub-7769757158085259/1049155691',
        autoShow: true,
        isTesting: true,
      });

      this.adMob.interstitial.prepare()
        .then((msg) => console.log('single page ad success', msg))
        .catch(err => console.error('single page ad failed ', err));
    }
  }

}
