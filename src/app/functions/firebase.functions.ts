import firebase from 'firebase/app'

export const convertFirestoreData = (obj: any): any => {
    if (!obj) return null;
    const _obj = {}
    Object.keys(obj).forEach(key => {
        _obj[key] = obj[key] instanceof firebase.firestore.Timestamp ? obj[key].toDate() : obj[key];
    })
    return _obj;
}

export const firestoreDate = (): Date => {
    return firebase.firestore.Timestamp.now().toDate();
}
