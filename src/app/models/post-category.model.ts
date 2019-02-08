export class PostCategoryModel {
    public categoryId: number;
    public postCount: number;
    public categoryName: string;
    public slug: string;

    constructor();
    /**
     * Initialize properties 
     * @param classProperties Properties of PostCategory model class
     */
    constructor(classProperties: Partial<PostCategoryModel>);
    constructor(classProperties?: Partial<PostCategoryModel>) {
        if (classProperties) {
            Object.assign(this, classProperties);
        }
    }
}