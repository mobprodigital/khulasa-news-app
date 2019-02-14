import { Injectable } from '@angular/core';
import { HttpParams } from "@angular/common/http";
import { PostModel } from 'src/app/models/post.model';
import { AjaxService } from '../ajax/ajax.service';
import { PostCategoryModel } from 'src/app/models/post-category.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(
    private http: AjaxService
  ) {

  }


  public getPostArchive(): Promise<PostModel[]>;
  public getPostArchive(categoryId: number): Promise<PostModel[]>;
  public getPostArchive(categoryId: number, count: number): Promise<PostModel[]>;
  public getPostArchive(categoryId: number, count: number, from: number): Promise<PostModel[]>;
  public getPostArchive(catId?: number, count?: number, from?: number): Promise<PostModel[]> {

    return new Promise((res, rej) => {
      let params: HttpParams = new HttpParams().set('action', 'get_post_archive');
      if (catId) {
        params = params.set('categoryId', catId.toString());
      }

      if (count) {
        params = params.set('count', count.toString());
      }

      if (from) {
        params = params.set('from', from.toString());
      }

      params = params.set('content_length', 'full');

      this.http.get(params).then((response: any) => {
        let posts = this.parsePosts(response);
        res(posts);
      }, err => rej(err));
    });
  }

  public getPost(postId: number): Promise<PostModel> {
    return new Promise((res, rej) => {
      this.http.get(
        new HttpParams()
          .set('action', 'get_single_post_by_id')
          .set('postId', postId.toString())
      )
        .then(resp => {
          let singlePost = this.parsePosts([resp]);
          res(singlePost[0]);
        })
        .catch(err => {
          rej(err);
        })
    });
  }

  public getMenuCategories(): Promise<PostCategoryModel[]> {
    return new Promise((res, rej) => {
      this.http.get(new HttpParams().set('action', 'get_menu')).then(menu => {
        let _menu = this.parsePostCategories(menu);
        res(_menu);
      }).catch(err => rej(err));
    })
  }

  public getRelatedPosts(postId: number): Promise<PostModel[]> {
    return new Promise((resolve, reject) => {
      this.http.get(new HttpParams()
        .set('action', 'get_related_posts')
        .set('post_id', postId.toString())
      ).then(data => {
        let posts = this.parsePosts(data);
        resolve(posts);
      }).catch(err => reject(err));
    })
  }

  private parsePosts = (posts: any[]): PostModel[] => posts && posts.length > 0
    ? posts.map(p => new PostModel({
      postId: p.id,
      author: p.author,
      slug: p.slug,
      category: p.category,
      content: p.content,
      title: p.title,
      portalUrl: p.url,
      thumbnail: p.thumbnail,
      date: p.date,
      categoryList: (p.categoryList && p.categoryList.length > 0) ? this.parsePostCategories(p.categoryList) : []
    })) :
    [];

  private parsePostCategories = (cats: any[]): PostCategoryModel[] => cats && cats.length > 0
    ? cats.map(c => new PostCategoryModel({
      categoryId: c.categoryId,
      categoryName: c.name,
      postCount: c.postCount,
      slug: c.slug,
    })) :
    [];

}
