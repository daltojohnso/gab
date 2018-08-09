import {db} from '~/firebase';
import get from 'lodash/get';
import firebase from 'firebase/app';
import {fetchNotes} from './notes';

const FieldPath = firebase.firestore.FieldPath;

export const fetchMaps = () => {
    return (dispatch, getState) => {
        const uid = get(getState(), ['auth', 'user', 'uid']);
        const sharedWithUid = new FieldPath('sharedWith', uid);
        return db
            .collection('maps')
            .where(sharedWithUid, '==', true)
            .get()
            .then(snapshot => {
                dispatch(setMaps(snapshot.docs));
                dispatch(selectMap());
                const mapId = get(getState(), ['maps', 'selectedMap', 'id']);
                dispatch(fetchNotes(mapId));
                return snapshot;
            });
    };
};

export const setMaps = mapDocs => ({
    type: 'maps/setMaps',
    maps: mapDocs.map(doc => {
        const data = doc.data();
        data.id = doc.id;
        return data;
    })
});

export const selectMap = () => ({
    type: 'maps/selectMap'
});
