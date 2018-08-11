import firebase from 'firebase/app';
import {db} from '~/firebase';
import get from 'lodash/get';
const {GeoPoint, TimeStamp} = firebase.firestore;
const pathToUid = ['auth', 'user', 'uid'];

export const fetchNotes = mapId => {
    return dispatch => {
        db.collection('notes')
            .where('mapId', '==', mapId)
            .get()
            .then(notesSnapshot => {
                const notes = notesSnapshot.docs.map(doc => {
                    const data = doc.data();
                    data.id = doc.id;
                    return data;
                });
                dispatch(addSubsetOfNotes(notes));
            });
    };
};

export const saveNote = (mapId, note) => {
    return note.id ? addNote(mapId, note) : updateNote(note);
};

export const addNote = (mapId, note) => {
    return (dispatch, getState) => {
        const state = getState();
        const uid = get(state, pathToUid);
        const {
            location: {latitude, longitude},
            message,
            rawMessage
        } = note;
        const location = new GeoPoint(latitude, longitude);
        const createdAt = new TimeStamp(Date.now());
        const newNote = {
            createdAt,
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
                dispatch(setNote(newNote));
            });
    };
};

export const updateNote = note => {
    return (dispatch, getState) => {
        const state = getState();
        const uid = get(state, pathToUid);
        const updatedNote = {
            ...note,
            updatedAt: new TimeStamp(Date.now()),
            updatedBy: uid
        };
        db.collection('notes')
            .doc(note.id)
            .update(updatedNote)
            .then(() => {
                dispatch(setNote(updatedNote));
            });
    };
};

export const deleteNote = noteId => {
    return dispatch => {
        db.collection('notes')
            .doc(noteId)
            .then(() => {
                dispatch(removeNote(noteId));
            });
    };
};

export const addSubsetOfNotes = notes => ({
    type: 'notes/addSubset',
    notes
});

export const setNote = note => {
    return {
        type: 'notes/set',
        note
    };
};

export const removeNote = noteId => ({
    type: 'notes/remove',
    noteId
});
