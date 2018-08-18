import {db} from '~/firebase';
import {nowTimestamp, getDataWithId} from '~/util';
import get from 'lodash/get';
import nav from './nav';

const pathToUid = ['auth', 'user', 'uid'];

export const fetchNotes = mapId => {
    return dispatch => {
        dispatch(nav.isLoading());
        db.collection('notes')
            .where('mapId', '==', mapId)
            .get()
            .then(snapshot => {
                const notes = getDataWithId(snapshot.docs);
                dispatch(addSubsetOfNotes(notes));
                dispatch(nav.isResolved());
            })
            .catch(err => {
                dispatch(nav.isRejected(err));
            });
    };
};

export const saveNote = (mapId, note) => {
    return !note.id ? addNote(mapId, note) : updateNote(note);
};

export const addNote = (mapId, note) => {
    return (dispatch, getState) => {
        const state = getState();
        const uid = get(state, pathToUid);
        const {location, message, rawMessage} = note;
        const newNote = {
            createdAt: nowTimestamp(),
            createdBy: uid,
            location,
            message,
            rawMessage,
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
            updatedAt: nowTimestamp(),
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
            .delete()
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
