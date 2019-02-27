import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { PostService } from 'src/app/services/post/post.service';
import { PostModel } from 'src/app/models/post.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-singal-page',
  templateUrl: './singal-page.component.html',
  styleUrls: ['./singal-page.component.scss']
})
export class SingalPageComponent implements OnInit {
  @Input() postId:number;
 // public postId: number;
  public post: PostModel;
  public errorMsg: string = '';
  private routeSubscription: Subscription;
  constructor(private activatedRoute: ActivatedRoute, private postService: PostService, private router: Router) {
    this.routeSubscription = this.router.events.subscribe(ev => {
      if (ev instanceof NavigationEnd) {
        this.getId();
      }
    })
  }

  private getPost() {
    this.postService.getPost(this.postId)
      .then(data => { this.post = data })
      .catch(err => this.errorMsg = err);
  }
  private getId() {
    this.postId = parseInt(this.activatedRoute.snapshot.paramMap.get('id'));
    if (this.postId) {
      this.getPost();
    }
  }
  ngOnInit() {

  }
  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }


}
