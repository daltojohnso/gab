import firebase from 'firebase/app';

export const appReady = () => ({
    type: 'auth/appReady'
});

export const userChanged = user => ({
    type: 'auth/userChanged',
    user
});

export const signingIn = () => ({
    type: 'auth/signingIn'
});

export const signedIn = () => ({
    type: 'auth/finishedSigningIn'
});

export const loginWithEmailAndPassword = (email, password) => {
    return dispatch => {
        dispatch(signingIn());
        return firebaseSignInWithEmailAndPassword(email, password).then(() => {
            dispatch(signingIn());
        });
    };
};

export function firebaseSignInWithEmailAndPassword(email, password) {
    return firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
            return firebase.auth().signInWithEmailAndPassword(email, password);
        });
}

export function signOut() {
    return firebase.auth().signOut();
}
