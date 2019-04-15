import { Component, OnInit, ViewChild, ViewChildren, QueryList, ElementRef, isDevMode } from '@angular/core';
import { PostModel } from 'src/app/models/post.model';
import { PostService } from 'src/app/services/post/post.service';
import { NavParams, ModalController, IonSlides } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AppLangService } from 'src/app/services/choose-lang/choose-lang.service';

interface SliderPostType {
  post: PostModel;
  relatedPosts: PostModel[];
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
  @ViewChildren('singlePostContent') singlePostContentList: QueryList<HTMLDivElement>;


  public sliderOptions: any = {
    loop: false
  };
  constructor(
    private postService: PostService,
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private iab: InAppBrowser,
    private share: SocialSharing,
    private appLangSvc: AppLangService
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
      });



      this.postService.getRelatedPosts(postData.postId).then(rp => {
        this.sliderPosts[0].relatedPosts = rp;
      });

      setTimeout(() => {
        this.openLinksInApp(0);
      }, 500);

      try {
        const postData1 = await this.getNextPost(postData.postId);
        this.sliderPosts.push(postData1);
        this.postFetchedList.add(postData.postId);
        setTimeout(() => {
          this.openLinksInApp(1);
        }, 500);

        const postData2 = await this.getNextPost(postData1.post.postId);
        this.sliderPosts.push(postData2);

        this.postFetchedList.add(postData1.post.postId);
        setTimeout(() => {
          this.openLinksInApp(2);
        }, 500);
      } catch (err) {
        console.log('error : ', err);
      }
    }
  }


  public goBack() {
    this.modalCtrl.dismiss();
  }

  public async sharePost() {

    const postIndex = await this.slider.getActiveIndex();
    const activeContent: Array<ElementRef<HTMLElement>> = this.singlePostContentList['_results'];
    const postContentHTML = activeContent[postIndex];
    const post = this.sliderPosts[postIndex].post;
    const shareOptions = {
      message: postContentHTML ? postContentHTML.nativeElement.innerText.substr(0, 20) : post.content.substr(0, 100),
      chooserTitle: 'Share title',
      subject: post.title,
      url: `https://m.khulasa-news.com/${post.slug}/${this.appLangSvc.selectedLang}`,
    };
    this.share.shareWithOptions(shareOptions).catch(err => {
      console.log('err in sharing : ', err);
    });

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

  public async onSlidePrev() {
    const activeIndex = await this.slider.getActiveIndex();

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

      const model = await this.modalCtrl.create({
        component: SingleNewsComponent,
        componentProps: {
          post: p
        }
      });
      model.present();
    }
  }



  public async openLinksInApp(targetSlideIndex: number | undefined) {
    if (typeof targetSlideIndex === 'undefined') {
      targetSlideIndex = await this.slider.getActiveIndex();
    }

    try {
      const activeContent: Array<ElementRef<HTMLElement>> = this.singlePostContentList['_results'];
      if (!activeContent || activeContent.length === 0) {
        return;
      }
      if (!activeContent[targetSlideIndex]) {
        return;
      }
      const element = <HTMLElement>activeContent[targetSlideIndex].nativeElement;
      if (element && element.getAttribute('data-ancdisabled') !== 'true') {
        const anchorArr = element.querySelectorAll('a');
        if (anchorArr && anchorArr.length > 0) {
          for (let i = 0; i < anchorArr.length; i++) {
            const href = anchorArr[i].href;
            anchorArr[i].removeAttribute('href');
            anchorArr[i].addEventListener('click', (ev: MouseEvent) => {
              ev.preventDefault();
              this.iab.create(href, '_self', { location: 'no' });
              // window.open(href, '_self', 'location=no');
              return false;
            });
          }
        }
        element.setAttribute('data-ancdisabled', 'true');
      }
    } catch (err) {
      console.log(err);
    }
  }

  

}
