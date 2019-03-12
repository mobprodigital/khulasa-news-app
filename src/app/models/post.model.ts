import { PostCategoryModel } from './post-category.model';
import { PostCommentModel } from './post-comment.model';
import { SafeResourceUrl } from '@angular/platform-browser';

export class PostModel {
    public postId: number = 0;
    public author: string = '';
    public date: string | Date = '';
    public content: string = '';
    public slug: string = '';
    public title: string = '';
    public thumbnail: string = '';
    public portalUrl: string = '';
    public category: string = '';
    public categoryList: PostCategoryModel[] = [];
    public comments: PostCommentModel[] = [];
    public videoUrl: SafeResourceUrl = '';
    public isVideoPost: boolean = false;
    constructor();
    /**
     * Initialize properties
     * @param partialPostModel Properties of Post model class
     */
    constructor(partialPostModel: Partial<PostModel>);
    constructor(args?: Partial<PostModel>) {
        if (args) {
            Object.keys(args).forEach(key => {
                this[key] = args[key];
            });
        }
    }
}