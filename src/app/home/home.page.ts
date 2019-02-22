import { Component, OnDestroy, OnInit } from '@angular/core';
import { PostService } from '../services/post/post.service';
import { PostCategoryModel } from '../models/post-category.model';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnDestroy, OnInit {

  public activeCategoryId: number = 42;

  public menuCategories: PostCategoryModel[] = [];
  constructor(
    private postService: PostService,
    private menuCtrl: MenuController,
  ) {

    this.getMenu();
  }






  private async getMenu() {
    try {
      this.menuCategories = await this.postService.getMenuCategories();
    } catch (err) {
      alert(err);
    }
  }

  public openMenu() {
    this.menuCtrl.open();
  }



  ngOnInit(): void {
  }

  ngOnDestroy(): void {

  }

}
