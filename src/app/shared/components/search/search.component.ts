import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post/post.service';
import { PostModel } from 'src/app/models/post.model';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  public searchTerm: string;
  public searhResults: PostModel[] = [];
  public errMsg: string;
  public loading: boolean = false;
  public loadMoreLoading: boolean = false;
  constructor(private postService: PostService, private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  public async searchNews() {
    this.errMsg = '';
    if (this.searchTerm) {
      this.loading = true;
      try {
        this.searhResults = await this.getSearchPosts();
        this.loading = false;
      } catch (err) {
        this.searhResults = [];
        this.errMsg = err;
        this.loading = false;
      }
    }
  }

  private getSearchPosts(from: number = 1, count: number = 10): Promise<PostModel[]> {
    return new Promise(async (resolve, reject) => {
      try {

        const result = await this.postService.searchPosts(this.searchTerm, from, count, 'full');
        if (result) {
          resolve(result);
        } else {
          reject('No search result found');
        }

      } catch (err) {
        this.loading = false;
        reject(err);
      }
    });
  }

  public async loadMoreNews() {
    if (!this.searchTerm) {
      return;
    }
    try {
      this.loadMoreLoading = true;
      const result = await this.getSearchPosts(this.searhResults.length + 1);
      if (result && result.length > 0) {
        this.searhResults.push(...result);
      }
      this.loadMoreLoading = false;
    } catch (err) {
      alert('No more news found');
      this.loadMoreLoading = false;
    }

  }

  public async goBack() {
    this.modalCtrl.dismiss();
  }


}
