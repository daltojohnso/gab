import {db} from '~/firebase';
import flatten from 'lodash/flatten';
import get from 'lodash/get';
import firebase from 'firebase/app';
import {fetchNotes} from './notes';
import {fetchUsers} from './users';
import nav from './nav';
import {getDataWithId} from '~/util';
const FieldPath = firebase.firestore.FieldPath;

export const fetchFirstMapAndNotes = () => {
    return (dispatch, getState) => {
        dispatch(nav.isLoading());
        const uid = get(getState(), ['auth', 'user', 'uid']);
        const sharedWithUid = new FieldPath('sharedWith', uid);
        return db
            .collection('maps')
            .where(sharedWithUid, '==', true)
            .limit(1)
            .get()
            .then(snapshot => {
                // resolve nav in fetchNotes
                const maps = getDataWithId(snapshot.docs);
                dispatch(setMaps(maps));
                const sharedWith = get(maps, ['0', 'sharedWith'], {});
                const selectedMapId = get(maps, ['0', 'id']);
                dispatch(setSelectedMap(selectedMapId));
                dispatch(fetchUsers(Object.keys(sharedWith)));
                dispatch(fetchNotes(selectedMapId));
            })
            .catch(err => {
                dispatch(nav.isRejected(err));
            });
    };
};

export const fetchMap = mapId => {
    return dispatch => {
        return db
            .collection('maps')
            .doc(mapId)
            .get()
            .then(doc => {
                const map = doc.data();
                map.id = doc.id;
                dispatch(setMaps([map]));
                const sharedWith = get(map, ['0', 'sharedWith'], {});
                dispatch(fetchUsers(Object.keys(sharedWith)));
            });
    };
};

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
                const userIds = flatten(maps.map(map => Object.keys(map.sharedWith)));
                dispatch(userIds);
            });
    };
};

export const setMaps = maps => ({
    type: 'maps/setSubset',
    maps
});

export const setSelectedMap = selectedMapId => ({
    type: 'maps/setSelectedMap',
    selectedMapId
});
