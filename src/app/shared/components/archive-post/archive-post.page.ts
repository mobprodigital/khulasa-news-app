import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { PostModel } from 'src/app/models/post.model';
import { ModalController } from '@ionic/angular';
import { SingleNewsComponent } from 'src/app/home/components/single-news/single-news.component';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AppLangService } from 'src/app/services/choose-lang/choose-lang.service';

@Component({
  selector: 'app-archive-post',
  templateUrl: './archive-post.page.html',
  styleUrls: ['./archive-post.page.scss'],
})
export class ArchivePostPage implements OnInit {

  @Output() postViewed = new EventEmitter();
  @Output() postClosed = new EventEmitter();

  @ViewChild('postContent') postContent: ElementRef;
  public isVideo = false;

  @Input() post: PostModel;

  constructor(
    private modelCtrl: ModalController,
    private share: SocialSharing,
    private appLangSvc: AppLangService
  ) { }

  ngOnInit() {
    this.isVideo = this.post.categoryList.some(cat => cat.categoryId === 47);
  }
  /**
   * Go to single post page
   */
  public async viewPost() {
    if (this.post) {
      const model = await this.modelCtrl.create({
        component: SingleNewsComponent,
        componentProps: {
          post: this.post
        }
      });
      model.onDidDismiss().finally(() => {
        this.postClosed.emit();
      });
      model.present().then(p => {
        this.postViewed.emit();
      }).catch(err => {
        console.log('error : ', err);
      });
    }
  }


  public sharePost(ev: MouseEvent) {
    ev.stopPropagation();
    ev.preventDefault();
    const postContentDiv: HTMLDivElement = this.postContent.nativeElement;
    const shareOptions = {
      message: postContentDiv ? postContentDiv.innerText.substr(0, 20) : this.post.content.substr(0, 100),
      chooserTitle: 'Share news via',
      subject: this.post.title,
      url: `https://m.khulasa-news.com/${this.post.slug}/${this.appLangSvc.selectedLang}`,
    };

    this.share.shareWithOptions(shareOptions)
      .catch(err => {
        console.log('err in sharing : ', err);
      });
  }

}
