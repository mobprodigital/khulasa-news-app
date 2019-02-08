import { Component, OnInit, Input } from '@angular/core';
import { PostModel } from 'src/app/models/post.model';

@Component({
  selector: 'app-archive-post',
  templateUrl: './archive-post.page.html',
  styleUrls: ['./archive-post.page.scss'],
})
export class ArchivePostPage implements OnInit {

  @Input() post: PostModel;

  constructor() { }

  ngOnInit() {
  }

}
