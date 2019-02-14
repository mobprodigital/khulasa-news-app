import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from 'src/app/services/post/post.service';
import { PostModel } from 'src/app/models/post.model';
import { NavController, ModalController } from '@ionic/angular';
import { SingleNewsComponent } from '../single-news/single-news.component';
import { Subscription } from 'rxjs';
import { RoutedEventEmitterService } from 'src/app/services/routed-event-emitter/routed-event-emitter.service';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss'],
})
export class ArchiveComponent implements OnInit {
  public postsList: PostModel[] = [];
  private subscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private postService: PostService,
    private modelCtrl: ModalController,
    private router : Router,
    private rEventService : RoutedEventEmitterService
  ) {
    this.getCatId();
  }


  /**
   * Get current category id
   */
  private getCatId() {
    let id = this.activatedRoute.snapshot.paramMap.get('id');

    if (id) {
      try {
        const catId = parseInt(id);
        this.getPosts(catId);
      }
      catch (err) {
        alert(err);
      }
    }
  }


  private async getPosts(categoryId?: number) {
    try {
      this.postsList = await this.postService.getPostArchive(categoryId, 10, 1);
    }
    catch (err) { alert(err); };
  }

  ngOnInit() {
    
  }

  public async viewPost(p: PostModel) {
    if (p) {
      let model = await this.modelCtrl.create({
        component: SingleNewsComponent,
        componentProps: {
          post: p
        }
      });
      model.present();
    }
  }

}
