export interface Post {
    thumbnail: any;
    title: string;
    privacy: ('public' | 'private');
    content: string;
    author: string;
}
