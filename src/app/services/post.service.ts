import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { Post } from '../models/post';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import firebase from 'firebase/app';
import 'firebase/firestore';

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
    const meta = { contentType: 'image/jpg', cacheControl: 'private, max-age=15552000' };
    const fileUploadTask = storageRef.putString(imageURL, 'data_url', meta);

    fileUploadTask.then(snapshot => {
      snapshot.ref.getDownloadURL().then(
        url => {
          // const post: Post = {
          //   // tslint:disable-next-line: object-literal-shorthand
          //   id: id,
          //   thumbnail: url
          // };
          // this.addEditPost(post);
        }
      );
    });

    return { percentageChanges: fileUploadTask, id };
  }

  public addEditPost(post: Post): Promise<any> {
    if (!post.id || post.id === null) {
      post.id = this.afs.createId();
      const date: Date = new Date();
      let x = this.auth?.currentUser?.points;
      let confirm1 = false;
      let confirm2 = false;
      if (x && x.points && x.points.length > 0) {
        x.points.forEach(data => {
          if (data.year === date.getFullYear()) {
            confirm1 = true;
            data.points.forEach(data2 => {
              if (data2.month === date.getMonth()) {
                data2.point += 5;
                confirm2 = true;
              }
              return data2;
            });
          }
          return data;
        });
      }
      if (confirm1 === false) {
        if (!x) {
          x = {
            fromPoint: { year: date.getFullYear(), month: date.getMonth() },
            points: []
          };
        }
        if (!x.points) { x.points = []; }
        x.points.push({
          year: date.getFullYear(),
          points: [{
            month: date.getMonth(),
            point: 5
          }]
        });
      }
      else if (confirm2 === false) {
        x.points.forEach(data => {
          if (data.year === date.getFullYear()) {
            if (!data.points) { data.points = []; }
            data.points.push({
              month: date.getMonth(),
              point: 5
            });
          }
        });
      }
      this.auth.updateUserData({uid: this.auth?.currentUser?.uid, totalPoints: firebase.firestore.FieldValue.increment(5) as any,
      points: x
      });
    }
    post.author = this.auth?.currentUser?.name || 'no name';
    post.authorId = this.auth?.currentUser?.uid || 'no uid';
    if (this.auth?.currentUser?.photoURL) { post.authorURL = this.auth?.currentUser?.photoURL; }

    return this.afs.collection(environment.database.posts).doc(post.id).set(post, { merge: true });
  }



  // tslint:disable: member-ordering
  // tslint:disable-next-line: variable-name
  private _posts: Post[] = [];
  public getPosts(): Observable<Post[]> {
    this._posts = [];
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

  public getPost(id: string): Observable<Post> {
    return this.afs.collection(environment.database.posts).doc(id).valueChanges();
  }
}
