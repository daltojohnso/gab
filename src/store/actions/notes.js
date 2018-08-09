import {db} from '~/firebase';

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

export const setNotes = (mapId, noteDocs) => ({
    type: 'notes/setNotes',
    mapId,
    notes: noteDocs.map(doc => {
        const data = doc.data();
        data.id = doc.id;
        return data;
    })
});
