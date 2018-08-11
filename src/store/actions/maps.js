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
                const maps = snapshot.docs.map(doc => {
                    const data = doc.data();
                    data.id = doc.id;
                    return data;
                });
                dispatch(setMaps(maps));
                const selectedMapId = get(maps, ['0', 'id']);
                dispatch(setSelectedMap(selectedMapId));
                dispatch(fetchNotes(selectedMapId));
            });
    };
};

export const setMaps = maps => ({
    type: 'maps/setMaps',
    maps
});

export const setSelectedMap = selectedMapId => ({
    type: 'maps/setSelectedMap',
    selectedMapId
});
