import { Component, OnInit } from '@angular/core';
import { PostModel } from 'src/app/models/post.model';
import { ActivatedRoute } from '@angular/router';
import { PostService } from 'src/app/services/post/post.service';
import { NavController, NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-single-news',
  templateUrl: './single-news.component.html',
  styleUrls: ['./single-news.component.scss']
})
export class SingleNewsComponent implements OnInit {
  public post: PostModel;

  constructor(
    private postService: PostService,
    private navParams: NavParams,
    private modalCtrl: ModalController
  ) {
    this.getNewsId();
  }

  ngOnInit() {

  }

  private getNewsId() {
    // let id = this.activatedRoute.snapshot.paramMap.get('id');
    // let id  = this.navParams.get('id');
    let postData = <PostModel>this.navParams.get('id');
    this.post = postData;
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

  private async getNewsById(newsId: number) {
    try {
      this.post = await this.postService.getPost(newsId);
    }
    catch (err) {
      alert(err);
    }
  }

  public goBack() {
    // this.navCtrl.back();
    this.modalCtrl.dismiss();
  }

}
