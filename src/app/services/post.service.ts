import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { Post } from '../models/post';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private storage: AngularFireStorage, private afs: AngularFirestore, private auth: AuthService) { }

  public uploadThumbnail(imageURL: string): any {
    if (!imageURL) { throw new Error('Invalid Parameters'); }
    const id = this.afs.createId();
    const filePath = 'thumbnails' + '/' + id + '.jpg';
    const storageRef = this.storage.ref(filePath);
    const meta = { contentType: 'image/jpg' };
    const fileUploadTask = storageRef.putString(imageURL, 'data_url', meta);

    fileUploadTask.then(snapshot => {
      snapshot.ref.getDownloadURL().then(
        url => {
          console.log(url);
          const post: Post = {
            author: this.auth?.currentUser?.name || 'no name',
            // tslint:disable-next-line: object-literal-shorthand
            id: id,
            thumbnail: url
          };
          this.addEditPost(post);
        }
      );
    });

    return {percentageChanges: fileUploadTask, id};
  }

  public addEditPost(post: Post): Promise<any> {
    if (!post.id) {
      post.id = this.afs.createId();
    }
    return this.afs.collection(environment.database.posts).doc(post.id).set(post, { merge: true });
  }

  // tslint:disable: member-ordering
  // tslint:disable-next-line: variable-name
  private _posts: Post[] = [];
  public getPosts(): Observable<Post[]> {
    return this.afs.collection(environment.database.posts, ref => {
      return ref.orderBy('time', 'desc'); // .limit(100)
    }).stateChanges().pipe(map(changes => {
      changes.forEach(change => {
        if (['added', 'modified'].includes(change.type)) {
          const post2: Post = change.payload.doc.data();
          // post.time = (<any>post.time).toDate();
          post2.id = change.payload.doc.id;
          if (change.type === 'added') { this._posts.splice(change.payload.newIndex, 0, post2); }
          else { this._posts[change.payload.newIndex] = post2; }
        } else if (change.type === 'removed') { this._posts.splice(change.payload.oldIndex, 1); }
      });
      return this._posts;
    }));
  }
}
