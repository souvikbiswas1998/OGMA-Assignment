export interface Post {
    id?: string;
    thumbnail?: any;
    title?: string;
    privacy?: ('public' | 'private');
    content?: string;
    author: string;
}
