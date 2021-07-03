import { Injectable } from '@angular/core';
import { firestoreDate } from '../functions/firebase.functions';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { Post } from '../models/post';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

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
}
