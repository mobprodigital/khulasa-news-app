import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post/post.service';
import { PostModel } from 'src/app/models/post.model';

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
  constructor(private postService: PostService) { }

  ngOnInit() {
  }

  public async searchNews() {
    this.errMsg = '';
    if (this.searchTerm) {
      try {
        this.searhResults = await this.getSearchPosts();
      } catch (err) {
        this.searhResults = [];
        this.errMsg = err;
      }
    }
  }

  private getSearchPosts(from: number = 1, count: number = 10): Promise<PostModel[]> {
    return new Promise(async (resolve, reject) => {
      try {
        this.loading = true;
        const result = await this.postService.searchPosts(this.searchTerm, from, count, 'full');
        this.loading = false;
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


}
