import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
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


  public getPostArchive(catId?: number, count?: number, from?: number, contentLength?: 'full' | 'short'): Promise<PostModel[]> {

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

      if (contentLength) {
        params = params.set('content_length', contentLength);
      } else {
        params = params.set('content_length', 'full');
      }

      this.http.get(params).then((response: any) => {
        const posts = this.parsePosts(response);
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
          const singlePost = this.parsePosts([resp]);
          res(singlePost[0]);
        })
        .catch(err => {
          rej(err);
        });
    });
  }

  public getMenuCategories(): Promise<PostCategoryModel[]> {
    return new Promise((res, rej) => {

      const localMenuData: any = localStorage.getItem('kn_menu');
      if (localMenuData) {
        try {
          const data: PostCategoryModel[] = this.parsePostCategories(JSON.parse(localMenuData));
          res(data);
        } catch (err) {
          console.error(err);
        }
      } else {
        this.http.get(new HttpParams().set('action', 'get_menu')).then(menu => {
          const _menu = this.parsePostCategories(menu);
          localStorage.setItem('kn_menu', JSON.stringify(menu));
          res(_menu);
        }).catch(err => rej(err));
      }
    });
  }

  public getRelatedPosts(postId: number): Promise<PostModel[]> {
    return new Promise((resolve, reject) => {
      this.http.get(new HttpParams()
        .set('action', 'get_related_posts')
        .set('post_id', postId.toString())
      ).then(data => {
        const posts = this.parsePosts(data);
        resolve(posts);
      }).catch(err => reject(err));
    });
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
    []

  private parsePostCategories = (cats: any[]): PostCategoryModel[] => cats && cats.length > 0
    ? cats.map(c => new PostCategoryModel({
      categoryId: c.categoryId,
      categoryName: c.name,
      postCount: c.postCount,
      slug: c.slug,
    })) :
    []

  /**
   * Get next post of current post
   * @param postId current the post id
   * @param postDirection (default is previous) Next of previous post
   * @param contentLength (default is full )length of content
   * @param inSameCategory (default is false ) Weather you want the post of same category
   */
  public getAdjecentPost(
    postId: number,
    postDirection: 'next' | 'previous' = 'previous',
    contentLength: 'full' | 'short' = 'full',
    inSameCategory: 'true' | 'false' = 'false'
  ): Promise<PostModel> {
    return new Promise((resolve, reject) => {
      let params = new HttpParams()
        .set('postId', postId.toString())
        .set('contentLength', contentLength)
        .set('inSameCategory', inSameCategory);
      if (postDirection === 'next') {
        params = params.set('action', 'get_next_post');
      } else if (postDirection === 'previous') {
        params = params.set('action', 'get_prev_post');
      } else {
        throw new Error('postDirection value mismatch');
      }
      this.http.get(
        params
      ).then(data => {
        const nextPost = this.parsePosts([data]);
        resolve(nextPost[0]);
      }).catch(err => {
        reject(err);
      });
    });
  }

  /**
   * Search posts in database
   * @param searchTerm Search term string
   */
  public searchPosts(
    searchTerm: string,
    from: number = 1,
    count: number = 10,
    contentLength: 'full' | 'short' = 'short'): Promise<PostModel[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const resp = await this.http.get(
          new HttpParams().set('action', 'search_posts')
            .set('search_term', searchTerm)
            .set('from', from.toString())
            .set('count', count.toString())
            .set('content_length', contentLength)
        );
        if (resp) {
          const posts = this.parsePosts(resp);
          resolve(posts);
        } else {
          reject('No result found');
        }
      } catch (err) {
        reject(err);
      }
    });
  }

}
