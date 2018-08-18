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
        dispatch(isLoading());
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

        return db.collection('notes')
            .add(newNote)
            .then(doc => {
                newNote.id = doc.id;
                dispatch(setNote(newNote));
                dispatch(isResolved());
            })
            .catch(err => {
                dispatch(isRejected(err));
                return Promise.reject(err);
            });
    };
};

export const updateNote = note => {
    return (dispatch, getState) => {
        dispatch(isLoading());
        const state = getState();
        const uid = get(state, pathToUid);
        const updatedNote = {
            ...note,
            updatedAt: nowTimestamp(),
            updatedBy: uid
        };
        return db.collection('notes')
            .doc(note.id)
            .update(updatedNote)
            .then(() => {
                dispatch(setNote(updatedNote));
                dispatch(isResolved());
            }, err => {
                dispatch(isRejected(err));
                return Promise.reject(err);
            });
    };
};

export const deleteNote = noteId => {
    return dispatch => {
        dispatch(isLoading());
        return db.collection('notes')
            .doc(noteId)
            .delete()
            .then(() => {
                dispatch(removeNote(noteId));
                dispatch(isResolved());
            })
            .catch(err => {
                dispatch(isRejected(err));
                return Promise.reject(err);
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

export const isLoading = () => ({
    type: 'notes/isLoading'
});

export const isResolved = () => ({
    type: 'notes/isResolved'
});

export const isRejected = () => ({
    type: 'notes/isRejected'
});

export const resetState = () => ({
    type: 'notes/resetState'
});
