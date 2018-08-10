import firebase from 'firebase/app';
import {db} from '~/firebase';
import get from 'lodash/get';

export const fetchNotes = mapId => {
    // eventually, dispatch loading state for `mapId`
    return dispatch => {
        db.collection('notes')
            .where('mapId', '==', mapId)
            .get()
            .then(notesSnapshot => {
                dispatch(setNotes(mapId, notesSnapshot.docs));
            });
    };
};

export const saveNote = (mapId, note) => {
    return (dispatch, getState) => {
        const state = getState();
        const uid = get(state, ['auth', 'user', 'uid']);
        const {location: {latitude, longitude}, message, rawMessage} = note;
        const location = new firebase.firestore.GeoPoint(latitude, longitude);
        const newNote = {
            createdAt: Date.now(),
            createdBy: uid,
            location,
            message,
            rawMessage: JSON.stringify(rawMessage),
            mapId
        };
        db.collection('notes')
            .add(newNote)
            .then(doc => {
                newNote.id = doc.id;
                dispatch(setNote(mapId, newNote));
            });
    };
};

export const setNotes = (mapId, noteDocs) => ({
    type: 'notes/setNotes',
    mapId,
    notes: noteDocs.map(doc => {
        const data = doc.data();
        data.id = doc.id;
        return data;
    })
});

export const setNote = (mapId, note) => {
    return {
        type: 'notes/setNote',
        mapId,
        note
    };
};
