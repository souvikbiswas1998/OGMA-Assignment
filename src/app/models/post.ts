export interface Post {
    id?: string;
    thumbnail?: any;
    title?: string;
    privacy?: ('1' | '2');
    content?: string;
    author?: string;
    time?: Date;
    authorId?: string;
}
