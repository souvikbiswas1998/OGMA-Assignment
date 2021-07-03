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

  public uploadThumbnail(blob: Blob): AngularFireUploadTask {
    if (!blob) { throw new Error('Invalid Parameters'); }
    const filePath = 'profile-photos' + '/' + firestoreDate() + '.jpg';
    const storageRef = this.storage.ref(filePath);
    const meta = { cacheControl: 'private, max-age=15552000' };
    const fileUploadTask = storageRef.put(blob, meta);

    fileUploadTask.then(snapshot => {
      snapshot.ref.getDownloadURL().then(
        url => {
          console.log(url);
          const post: Post = {
            author: this.auth?.currentUser?.name || 'no name',
            id: this.afs.createId(),
            thumbnail: url
          };
          this.addEditPost(post);
        }
      );
    });

    return fileUploadTask;
  }

  public addEditPost(post: Post): Promise<any> {
    return this.afs.collection(environment.database.posts).doc(post.id).set(post, {merge: true});
  }
}
