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

export const signingOut = () => ({
    type: 'auth/signingOut'
});

export const signedOut = () => ({
    type: 'auth/finishedSigningOut'
});

export const signOut = () => {
    return dispatch => {
        dispatch(signingOut());
        firebaseSignOut().then(() => {
            dispatch(signedOut());
        });
    };
};

export const loginWithEmailAndPassword = (email, password) => {
    return dispatch => {
        dispatch(signingIn());
        return firebaseSignInWithEmailAndPassword(email, password).then(() => {
            dispatch(signedIn());
        });
    };
};

export function firebaseSignInWithEmailAndPassword (email, password) {
    return firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
            return firebase.auth().signInWithEmailAndPassword(email, password);
        });
}

export function firebaseSignOut () {
    return firebase.auth().signOut();
}

export const loginAnonymously = () => {
    return dispatch => {
        dispatch(signingIn());
        return firebaseLoginAnonymously().then(() => {
            dispatch({type: 'auth/isAnon'});
            dispatch(signedIn());
        });
    };
};

export function firebaseLoginAnonymously () {
    return firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
            return firebase.auth().signInAnonymously();
        });
}
