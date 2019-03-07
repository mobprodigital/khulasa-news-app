export class PostCommentModel {
    public commnetId: string = '';
    public postId: string = '';
    public authorEmail: string = '';
    public commentDate: string = '';
    public comment: string = '';
    public parentId: string = '';
    public author: string = '';
    
    constructor();
    constructor(partialCommentModel: Partial<PostCommentModel>);
    constructor(args?: Partial<PostCommentModel>) {
        if (args) {
            Object.keys(args).forEach(key => {
                this[key] = args[key];
            });
        }
    }
}
