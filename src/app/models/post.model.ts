import { PostCategoryModel } from "./post-category.model";

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
    constructor();
    /**
     * Initialize properties 
     * @param classProperties Properties of Post model class
     */
    constructor(classProperties: Partial<PostModel>);
    constructor(classProperties?: Partial<PostModel>) {
        if (classProperties) {
            Object.assign(this, classProperties);
        }
    }
}