// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: 'AIzaSyCgmuzCFtps50Ng_V1PyEDKxjut_92l8qk',
    authDomain: 't-tax-db.firebaseapp.com',
    projectId: 't-tax-db',
    storageBucket: 't-tax-db.appspot.com',
    messagingSenderId: '281572092128',
    appId: '1:281572092128:web:3aef59eb7f7d6b37ecc885',
    measurementId: 'G-R0ZBK5G4GL'
  },
  database: {
    user: 'users_test',
    posts: 'posts_test',
    contact: 'contacts_test',
    requestList: 'requests_test',
    pui: 'public-user-info_test'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
