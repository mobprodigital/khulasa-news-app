import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from 'src/app/services/post/post.service';
import { PostModel } from 'src/app/models/post.model';
import { ModalController } from '@ionic/angular';
import { SingleNewsComponent } from '../single-news/single-news.component';
import { LoaderService } from 'src/app/services/loader/loader.service';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss'],
})
export class ArchiveComponent implements OnInit {
  public postsList: PostModel[] = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private postService: PostService,
    private modelCtrl: ModalController,
    private loadingSvc: LoaderService
  ) {
    this.getCatId();
  }


  /**
   * Get current category id
   */
  private getCatId() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    if (id) {
      try {
        const catId = parseInt(id, 10);
        this.getPosts(catId);
      } catch (err) {
        alert(err);
      }
    }
  }


  private async getPosts(categoryId?: number) {
    try {
      this.loadingSvc.show();
      this.postsList = await this.postService.getPostArchive(categoryId, 10, 1);
      this.loadingSvc.hide();
    } catch (err) { alert(err); this.loadingSvc.hide(); }
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

}
