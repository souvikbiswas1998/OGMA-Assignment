export interface Post {
    id?: string;
    thumbnail?: any;
    title?: string;
    privacy?: ('1' | '2');
    content?: string;
    author?: string;
    authorURL?: string;
    time?: Date;
    authorId?: string;
    isTrash?: boolean;
    isTrashDate?: Date;
}
