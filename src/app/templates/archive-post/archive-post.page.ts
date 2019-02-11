import { Component, OnInit, Input } from '@angular/core';
import { PostModel } from 'src/app/models/post.model';
import { ModalController } from '@ionic/angular';
import { SingleNewsComponent } from 'src/app/home/components/single-news/single-news.component';

@Component({
  selector: 'app-archive-post',
  templateUrl: './archive-post.page.html',
  styleUrls: ['./archive-post.page.scss'],
})
export class ArchivePostPage implements OnInit {

  @Input() post: PostModel;

  constructor(
    private modelCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  public async viewPost() {
    if (this.post) {
      let model = await this.modelCtrl.create({
        component: SingleNewsComponent,
        componentProps: {
          post: this.post
        }
      });
      model.present();
    }
  }


  public sharePost(){
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
