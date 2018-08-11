import config from './firebase-config';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import store from '~/store';

firebase.initializeApp(config);
export const db = firebase.firestore();
db.settings({
    timestampsInSnapshots: true
});

firebase.auth().onAuthStateChanged(user => {
    let currentUser = null;
    if (user) {
        currentUser = {
            displayName: user.displayName,
            email: user.email,
            emailVerified: user.emailVerified,
            uid: user.uid,
            photoURL: user.photoURL,
            isAnonymous: user.isAnonymous
        };
    }

    store.dispatch({type: 'auth/userChanged', user: currentUser});
    store.dispatch({type: 'auth/isReady'});
});

export const GeoPoint = firebase.firestore.GeoPoint;
export const Timestamp = firebase.firestore.Timestamp;
