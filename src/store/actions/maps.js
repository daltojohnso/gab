import { db } from '~/firebase';
import flatten from 'lodash/flatten';
import firebase from 'firebase/app';
import { fetchNotes } from './notes';
import { fetchUsers, fetchUsersOfMap } from './users';
import { getDataWithId, getUid } from '~/util';
const FieldPath = firebase.firestore.FieldPath;

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

export const fetchFirstMapAndNotes = () => {
    return withStatusUpdates(async (dispatch, getState) => {
        const state = getState();
        const maps = await fetchMapsForUser(getUid(state), 1);
        dispatch(setMaps(maps));
        const [map] = maps;
        const mapId = map.id;
        dispatch(setSelectedMap(mapId));
        return Promise.all([
            dispatch(fetchUsersOfMap(mapId)),
            dispatch(fetchNotes(mapId))
        ]);
    });
};

export const fetchSelectedMap = mapId => {
    return withStatusUpdates(async dispatch => {
        await dispatch(fetchMap(mapId));
        return Promise.all([
            dispatch(fetchUsersOfMap(mapId)),
            dispatch(fetchNotes(mapId))
        ]);
    });
};

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
        const userIds = flatten(maps.map(map => Object.keys(map.sharedWith)));
        dispatch(fetchUsers(userIds));
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

export const isLoading = () => ({
    type: 'maps/isLoading'
});

export const isResolved = () => ({
    type: 'maps/isResolved'
});

export const isRejected = () => ({
    type: 'maps/isRejected'
});
