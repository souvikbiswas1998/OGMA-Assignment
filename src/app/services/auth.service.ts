import { Injectable } from '@angular/core';
import { AngularFirestore, QueryFn } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { switchMap, map, first, takeUntil, filter } from 'rxjs/operators';
import firebase from 'firebase/app';
import 'firebase/auth';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';
  // tslint:disable: typedef
  // tslint:disable: variable-name

const COLLECTION_NAME = environment.database.user;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _auth = new BehaviorSubject<firebase.User>(undefined);
  public auth: Observable<firebase.User> = this._auth.asObservable().pipe(filter(v => v !== undefined));

  currentUser: User;
  ngUnsubscribe: Subject<any> = new Subject<any>();

  user: Observable<User> = this.afAuth.authState.pipe(
    switchMap((fbUser) => {
      if (fbUser) { return this.getUserData(fbUser.uid); } else { return of(null); }
    })
  );
  isAuthenticated: Observable<boolean> = this.afAuth.authState.pipe(map(user => {
    if (user) { return true; } else { return false; }
  }));

  isAnyUser: Observable<firebase.User> = this.afAuth.authState.pipe(map(user => {
    return user;
  }));

  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth, private router: Router) {
    this.user.pipe(takeUntil(this.ngUnsubscribe)).subscribe(user => { this.currentUser = user; });
    this.afAuth.authState.pipe(takeUntil(this.ngUnsubscribe)).subscribe(auth => this._auth.next(auth));
  }

  async signUp(user: User) {
    this.isUserFromEmail(user.email).then(async user1 => {
      if (user1) { return console.error('User already exists'); }
      await this.afAuth.createUserWithEmailAndPassword(user.email, user.password)
        .then((fbUser) => {
          localStorage.setItem('email', user.email);
          user.provider = 'email';
          user.uid = fbUser.user.uid;
          user.timeCreated = firebase.firestore.Timestamp.now().toDate();
          this.setUserData(user);
        });
    });
    this.router.navigate(['/auth/generate-passcode']);
  }

  async loginWithEmail(email: string, password: string) {
    await this.afAuth.signInWithEmailAndPassword(email, password)
      .then((fbUser) => {
        localStorage.setItem('email', email);
        this.updateUserData({ uid: fbUser.user.uid, lastLogin: new Date() });
        this.router.navigate(['/auth/passcode']);
      });
  }

  async SignOut() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    await this.afAuth.signOut()
      .then(() => {
        localStorage.clear();
        this.router.navigate(['/auth/login']);
      }).catch((error) => {
        window.alert(error.message);
      });
  }

  async setUserData(user: User) {
    const x: User = this.setUser(user);
    this.afs.collection(COLLECTION_NAME).doc(user.uid).set(x, { merge: true })
      .then(() => {
        const user1: User = { uid: user.uid };
        if (x.phoneNo) { user1.phoneNo = x.phoneNo; }
        if (x.email) { user1.email = x.email; }
        if (x.name) { user1.name = x.name; }
        this.afs.collection(environment.database.pui).doc(user.uid).set(user1, { merge: true });
      }).catch(error => { console.log(error); });
  }

  async updateUserData(user: User) {
    const uid = user.uid;
    delete user.uid;
    this.afs.collection(COLLECTION_NAME).doc(uid).update(user)
      .catch(error => { console.log(error); });
  }

  private setUser(user: User) {
    const _user: User = {
      name: user.name,
      timeCreated: firebase.firestore.Timestamp.now().toDate(),
      lastLogin: firebase.firestore.Timestamp.now().toDate(),
      lastPasswordModified: firebase.firestore.Timestamp.now().toDate(),
      provider: user.provider,
      userType: 'user',
    };
    if (user.email) { _user.email = user.email; }
    if (user.phoneNo) { _user.phoneNo = user.phoneNo; }
    if (user.photoURL) { _user.photoURL = user.photoURL; }
    if (user.userType) { _user.userType = user.userType; }
    return _user;
  }

  private getCollection(ref?: QueryFn) {
    return this.afs.collection(COLLECTION_NAME, ref);
  }

  private getUserData(uid: string): Observable<User> {
    return this.afs.collection(COLLECTION_NAME).doc(uid).valueChanges().pipe(takeUntil(this.ngUnsubscribe))
      .pipe(map((data: User) => { console.log('getUserData called'); if (data) { this.currentUser = data; } return { ...data, uid }; }));
  }

  public getUserDataPromise(uid: string): Promise<User> {
    return this.afs.collection(COLLECTION_NAME).doc(uid).get({ source: 'server' }).toPromise()
    .then(doc => {
      if (doc.exists) { return doc.data() as User; } else { return null; }
    });
  }

  public isUserFromEmail(email: string): Promise<User> {
    const result = this.getUserFromEmail(email);
    result.catch((e) => console.error('Internal Error', e));
    return result;
  }

  private getUserFromEmail(email: string): Promise<User> {
    return this.afs.collection(environment.database.pui, ref => ref.where('email', '==', email))
      .valueChanges({ idField: 'uid' }).pipe(first())
      .pipe(map(users => (users.length > 0) ? users[0] : null))
      .toPromise();
  }
}
