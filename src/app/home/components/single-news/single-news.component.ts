import { Component, OnInit } from '@angular/core';
import { PostModel } from 'src/app/models/post.model';
import { PostService } from 'src/app/services/post/post.service';
import { NavParams, ModalController } from '@ionic/angular';
import { SafeResourceUrl, DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-single-news',
  templateUrl: './single-news.component.html',
  styleUrls: ['./single-news.component.scss']
})
export class SingleNewsComponent implements OnInit {
  public post: PostModel;
  public youTubeUrl: SafeResourceUrl;
  public isVideoPost: boolean = false;
  public relatedPosts: PostModel[];
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

  private getNewsId() {
    // let id = this.activatedRoute.snapshot.paramMap.get('id');
    let postData = <PostModel>this.navParams.get('post');
    if (postData) {
      this.post = postData;
      if (this.post.categoryList.some(c => c.categoryId === 47)) {
        this.isVideoPost = true;
        this.youTubeUrl =  this.geturl(this.post.content);
      }
      else {
        this.isVideoPost = false;
      }
      this.getRelatedPosts(postData.postId);
    }
    // this.getRelatedPosts(this.post.postId);
    /* 
        if (id) {
          try {
            const catId = parseInt(id);
            this.getNewsById(catId);
          }
          catch (err) {
            alert(err);
          }
        } */
  }


  /**
   * get youtube yotube url from content string 
   * @param iframeString html string
   */
  public geturl(iframeString: string): SafeResourceUrl | null {
    let tempDiv: HTMLDivElement = document.createElement('div');
    tempDiv.innerHTML = iframeString;
    let ytIframe: HTMLIFrameElement = tempDiv.querySelector('iframe');
    if (ytIframe) {
      return this.domSanitizer.bypassSecurityTrustResourceUrl(ytIframe.src);
    }
    else {
      return null;
    }

  }

  private async getNewsById(newsId: number) {
    try {
      this.post = await this.postService.getPost(newsId);
    }
    catch (err) {
      alert(err);
    }
  }

  private async getRelatedPosts(postId: number) {
    try {
      this.relatedPosts = await this.postService.getRelatedPosts(postId);
    }
    catch (err) {

    }
  }

  public goBack() {
    this.modalCtrl.dismiss();
  }

  public sharePost(ev: MouseEvent) {
    ev.stopPropagation();

    if ('share' in navigator) {
      window.navigator['share']({
        title: this.post.title,
        text: this.post.content.substr(0, 100),
        url: this.post.portalUrl
      }).catch(err => {

      });
    }
    else {
      alert('share api is not supported in your device');
    }
  }

}
