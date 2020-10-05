import config from './firebase-config';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import store from '~/store';
import { batch } from 'react-redux';

firebase.initializeApp(config);

export const db = firebase.firestore();
export const GeoPoint = firebase.firestore.GeoPoint;
export const Timestamp = firebase.firestore.Timestamp;
export const FieldPath = firebase.firestore.FieldPath;

firebase.auth().onAuthStateChanged(user => {
    batch(() => {
        if (!user) {
            store.dispatch({ type: 'auth/userChanged', user: null });
        } else if (user.isAnonymous) {
            store.dispatch({ type: 'auth/isAnon' });
        } else {
            store.dispatch({
                type: 'auth/userChanged',
                user: {
                    displayName: user.displayName,
                    email: user.email,
                    emailVerified: user.emailVerified,
                    uid: user.uid,
                    photoURL: user.photoURL,
                    isAnonymous: user.isAnonymous
                }
            });
        }

        store.dispatch({ type: 'auth/isReady' });
    });
});
