import { Component, OnInit, Input } from '@angular/core';
import { PostService } from 'src/app/services/post/post.service';
import { PostModel } from 'src/app/models/post.model';
import { Subscription } from 'rxjs';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-singal-page',
  templateUrl: './singal-page.component.html',
  styleUrls: ['./singal-page.component.scss']
})
export class SingalPageComponent implements OnInit {

  @Input() pageId: number | string;
  @Input() pageTitle: string;

  public post: PostModel;
  public errorMsg: string = '';
  public loader: boolean = true;

  constructor(private postService: PostService, private modalCtrl: ModalController) {

  }

  private getPost() {
    this.errorMsg = '';
    if (typeof this.pageId === 'string') {
      this.postService.getPost(this.pageId as string)
        .then(data => { this.post = data; })
        .catch(err => { this.errorMsg = err; })
        .finally(() => this.loader = false);
    } else if (typeof this.pageId === 'number') {
      this.postService.getPost(this.pageId as number)
        .then(data => { this.post = data; })
        .catch(err => { this.errorMsg = err; })
        .finally(() => this.loader = false);
    }

  }
  public goBack() {
    this.modalCtrl.dismiss();
  }
  ngOnInit() {
    this.getPost();

  }



}
