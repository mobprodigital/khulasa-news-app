import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { PostModel } from 'src/app/models/post.model';
import { AjaxService } from '../ajax/ajax.service';
import { PostCategoryModel } from 'src/app/models/post-category.model';
import { PostCommentModel } from 'src/app/models/post-comment.model';
import { AppLangService } from '../choose-lang/choose-lang.service';
import { AppLanguageEnum } from 'src/app/interfaces/app-lang.enum';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(
    private http: AjaxService,
    private appLangService: AppLangService,
    private domSanitizer: DomSanitizer,
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

  public getPost(postId: number): Promise<PostModel>;
  public getPost(postSlug: string): Promise<PostModel>;
  public getPost(postIdOrSlug: number | string): Promise<PostModel> {
    return new Promise((res, rej) => {
      let _httpParams: HttpParams = new HttpParams()
        .set('action', 'get_single_post_by_id');
      if (typeof postIdOrSlug === 'string') {
        _httpParams = _httpParams.set('postSlug', postIdOrSlug);
      } else if (typeof postIdOrSlug === 'number') {
        _httpParams = _httpParams.set('postId', postIdOrSlug.toString());
      } else {
        rej('Argument type mismatch');
      }

      this.http.get(_httpParams)
        .then(resp => {
          const singlePost = this.parsePosts([resp]);
          res(singlePost[0]);
        })
        .catch(err => {
          rej(err);
        });
    });
  }


  private getLocalMenuData(): Promise<PostCategoryModel[]> {
    return new Promise((resolve, reject) => {
      const menuKey: string = this.appLangService.selectedLang === AppLanguageEnum.English ? 'kn_menu_eng' : 'kn_menu_hin';
      const localMenuData: any = localStorage.getItem(menuKey);
      if (localMenuData) {
        try {
          const data: PostCategoryModel[] = this.parsePostCategories(JSON.parse(localMenuData));
          resolve(data);
        } catch (err) {
          reject('no local data found');
        }
      } else {
        reject('no local data found');
      }
    });
  }

  public getMenuCategories(): Promise<PostCategoryModel[]> {
    return new Promise((res, rej) => {
      this.getLocalMenuData().then((localMenuData: PostCategoryModel[]) => {
        res(localMenuData);
      }).catch(() => {
        this.http.get(new HttpParams().set('action', 'get_menu')).then(menu => {
          const menuKey: string = this.appLangService.selectedLang === AppLanguageEnum.English ? 'kn_menu_eng' : 'kn_menu_hin';
          const _menu = this.parsePostCategories(menu);
          localStorage.setItem(menuKey, JSON.stringify(menu));
          res(_menu);
        }).catch(err => rej(err));
      });
    });
  }

  public getRelatedPosts(postId: number, contentLength: 'full' | 'short' = 'full'): Promise<PostModel[]> {
    return new Promise((resolve, reject) => {
      this.http.get(new HttpParams()
        .set('action', 'get_related_posts')
        .set('content_length', contentLength)
        .set('post_id', postId.toString())
      ).then(data => {
        const posts = this.parsePosts(data);
        resolve(posts);
      }).catch(err => reject(err));
    });
  }

  private parsePosts(posts: any[]): PostModel[] {
    let postsArr: PostModel[] = [];
    if (posts && posts.length > 0) {
      postsArr = posts.map(p => {

        const post = new PostModel({
          postId: p.id,
          author: p.author,
          slug: p.slug,
          category: p.category,
          content: p.content,
          title: p.title,
          portalUrl: p.url,
          thumbnail: p.thumbnail,
          date: p.date,
          comments: (p.comments && p.comments.length > 0) ? this.parseComments(p.comments) : [],
          categoryList: (p.categoryList && p.categoryList.length > 0) ? this.parsePostCategories(p.categoryList) : [],
        });

        post.isVideoPost = post.categoryList.some(c => c.categoryId === 47);
        if (post.isVideoPost) {
          post.videoUrl = this.getYoutubeUrl(post.content);
        }
        return post;
      });
    }
    return postsArr;
  }

  /**
   * get youtube yotube url from content string
   * @param iframeString html string
   */
  public getYoutubeUrl(iframeString: string): SafeResourceUrl | null {
    try {
      const tempDiv: HTMLDivElement = document.createElement('div');
      tempDiv.innerHTML = iframeString;
      const ytIframe: HTMLIFrameElement = tempDiv.querySelector('iframe');
      if (ytIframe) {
        return ytIframe.src;
        // return this.domSanitizer.bypassSecurityTrustResourceUrl(ytIframe.src + '?autoplay=0&rel=0');
      } else {
        return null;
      }
    } catch (err) {
      return null;
    }
  }

  private parseComments(comments: any[]): PostCommentModel[] {
    return comments.map(c => new PostCommentModel(
      {
        commnetId: c.comment_ID,
        postId: c.comment_post_ID,
        author: c.comment_author,
        authorEmail: c.comment_author_email,
        commentDate: c.comment_date,
        comment: c.comment_content ? c.comment_content.replace(/[^\w\s]/gi, '') : '',
        parentId: c.comment_parent
      }
    ));
  }

  private parsePostCategories(cats: any[]): PostCategoryModel[] {
    let catArr: PostCategoryModel[] = [];
    if (cats && cats.length > 0) {
      catArr = cats.map(c => new PostCategoryModel({
        categoryId: c.categoryId,
        categoryName: c.name,
        postCount: c.postCount,
        slug: c.slug,
      }));
    }
    return catArr;
  }

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
