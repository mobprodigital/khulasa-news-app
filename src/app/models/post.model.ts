import { PostCategoryModel } from './post-category.model';
import { PostCommentModel } from './post-comment.model';

export class PostModel {
    public postId: number;
    public author: string;
    public date: string | Date;
    public content: string;
    public slug: string;
    public title: string;
    public thumbnail: string;
    public portalUrl: string;
    public category: string;
    public categoryList: PostCategoryModel[];
    public comments: PostCommentModel[] = [];

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