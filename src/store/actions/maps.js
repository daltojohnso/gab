import { db, FieldPath } from '~/firebase';
import { fetchNotes, deleteNotesByMapId } from './notes';
import { fetchUsersOfMap } from './users';
import { nowTimestamp, getDataWithId, getUid } from '~/util';
import format from 'date-fns/format';

async function fetchMapsForUser (uid, limit) {
    const sharedWithUid = new FieldPath('sharedWith', uid);
    const query = db.collection('maps').where(sharedWithUid, '==', true);
    const snapshot = await (limit ? query.limit(1).get() : query.get());
    const maps = getDataWithId(snapshot.docs);
    return maps;
}

async function fetchMapById (mapId) {
    const doc = await db
        .collection('maps')
        .doc(mapId)
        .get();
    const map = doc.data();
    map.id = doc.id;
    return map;
}

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

async function add (map) {
    try {
        const doc = await db.collection('maps').add(map);
        return {
            ...map,
            id: doc.id
        };
    } catch (err) {
        console.error(err);
    }
}

async function update (map) {
    await db
        .collection('maps')
        .doc(map.id)
        .update(map);

    return { ...map };
}

async function remove (mapId) {
    await db
        .collection('maps')
        .doc(mapId)
        .delete();
    return mapId;
}

export const fetchMap = mapId => {
    return withStatusUpdates(async dispatch => {
        const map = await fetchMapById(mapId);
        dispatch(setMaps([map]));
        return Promise.all([
            dispatch(fetchUsersOfMap(mapId)),
            dispatch(fetchNotes(mapId))
        ]);
    });
};

export const fetchMaps = () => {
    return withStatusUpdates(async (dispatch, getState) => {
        const state = getState();
        const uid = getUid(state);
        const maps = await fetchMapsForUser(uid);
        dispatch(setMaps(maps));
    });
};

export const addMap = () => {
    return withStatusUpdates(async (dispatch, getState) => {
        const uid = getUid(getState());
        const formattedDate = format(new Date(), 'PPpp');
        const map = await add({
            name: `New Map, ${formattedDate}`,
            sharedWith: {
                [uid]: true
            },
            createdAt: nowTimestamp(),
            createdBy: uid
        });
        if (!map) return;
        dispatch(setMaps([map]));
        window.location = `/map/${map.id}`;
    });
};

export const updateMap = (map = {}) => {
    return withStatusUpdates(async dispatch => {
        const updatedMap = await update({
            ...map
        });
        dispatch(setMaps([updatedMap]));
    });
};

export const deleteMapAndNotes = mapId => {
    return withStatusUpdates(async dispatch => {
        await Promise.all([remove(mapId), dispatch(deleteNotesByMapId(mapId))]);
        dispatch(removeMap(mapId));
    });
};

export const setMaps = maps => ({
    type: 'maps/setSubset',
    maps
});

export const setSelectedMap = selectedMapId => ({
    type: 'maps/setSelectedMap',
    selectedMapId
});

export const removeMap = mapId => ({
    type: 'maps/remove',
    mapId
});

export const isLoading = () => ({
    type: 'maps/isLoading'
});

export const isResolved = () => ({
    type: 'maps/isResolved'
});

export const isRejected = error => ({
    type: 'maps/isRejected',
    error
});
