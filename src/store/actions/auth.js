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
    return async dispatch => {
        dispatch(signingOut());
        await firebaseSignOut();
        dispatch(signedOut());
    };
};

export const loginWithEmailAndPassword = (email, password) => {
    return async dispatch => {
        dispatch(signingIn());
        await firebaseSignInWithEmailAndPassword(email, password);
        dispatch(signedIn());
    };
};

export async function firebaseSignInWithEmailAndPassword (email, password) {
    await firebase.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    return firebase.auth().signInWithEmailAndPassword(email, password);
}

export function firebaseSignOut () {
    return firebase.auth().signOut();
}

export const loginAnonymously = () => {
    return async dispatch => {
        dispatch(signingIn());
        await firebaseLoginAnonymously();
        dispatch({ type: 'auth/isAnon' });
        dispatch(signedIn());
    };
};

export async function firebaseLoginAnonymously () {
    await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    firebase.auth().signInAnonymously();
}
