import { db } from '~/firebase';
import { nowTimestamp, getDataWithId, getUid } from '~/util';

function withStatusUpdates (cb) {
    return async (...args) => {
        const [dispatch] = args;
        dispatch(isLoading());
        try {
            await cb(...args);
            dispatch(isResolved());
        } catch (err) {
            dispatch(isRejected(err));
        }
    };
}

async function fetchNotesByMapId (mapId) {
    const snapshot = await db
        .collection('notes')
        .where('mapId', '==', mapId)
        .get();

    const notes = getDataWithId(snapshot.docs);
    return notes;
}

async function add (note) {
    const doc = await db.collection('notes').add(note);
    return {
        ...note,
        id: doc.id
    };
}

async function update (note) {
    await db
        .collection('notes')
        .doc(note.id)
        .update(note);

    return { ...note };
}

async function remove (noteId) {
    await db
        .collection('notes')
        .doc(noteId)
        .delete();
    return noteId;
}

export const fetchNotes = mapId => {
    return withStatusUpdates(async dispatch => {
        const notes = await fetchNotesByMapId(mapId);
        dispatch(addSubsetOfNotes(notes));
    });
};

export const saveNote = (mapId, note) => {
    return !note.id ? addNote(mapId, note) : updateNote(note);
};

export const addNote = (mapId, { location, message, rawMessage }) => {
    return withStatusUpdates(async (dispatch, getState) => {
        const state = getState();
        const uid = getUid(state);
        const note = await add({
            location,
            message,
            rawMessage,
            mapId,
            createdAt: nowTimestamp(),
            createdBy: uid
        });
        dispatch(setNote(note));
    });
};

export const updateNote = note => {
    return withStatusUpdates(async (dispatch, getState) => {
        const state = getState();
        const uid = getUid(state);
        const updatedNote = await update({
            ...note,
            updatedAt: nowTimestamp(),
            updatedBy: uid
        });
        dispatch(setNote(updatedNote));
    });
};

export const deleteNote = noteId => {
    return withStatusUpdates(async dispatch => {
        await remove(noteId);
        dispatch(removeNote(noteId));
    });
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
