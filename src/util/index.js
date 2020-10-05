import { Timestamp } from '~/firebase';
import isArray from 'lodash/isArray';
import isPlainObject from 'lodash/isPlainObject';
import toPairs from 'lodash/toPairs';
import get from 'lodash/get';
import { EditorState, ContentState, convertFromRaw } from 'draft-js';

// this could be better
export function bindAll (_this, fns = []) {
    fns.forEach(fn => {
        if (isArray(fn)) {
            const fnName = fn.shift();
            _this[fnName] = _this[fnName].bind(_this, ...fn);
        } else if (isPlainObject(fn)) {
            toPairs(fn).forEach(([key, value]) => {
                _this[key] = isArray(value)
                    ? get(_this, value.shift()).bind(_this, ...value)
                    : get(_this, value).bind(_this);
            });
        } else {
            _this[fn] = _this[fn].bind(_this);
        }
    });
}

export function nowTimestamp () {
    return Timestamp.now();
}

export function getDataWithId (docs) {
    return docs.map(doc => {
        const data = doc.data();
        data.id = doc.id;
        return data;
    });
}

export const EDITOR_EVENTS = {};

export const EDITOR_STATES = {
    edit: 'edit',
    delete: 'delete',
    confirmDelete: 'confirmDelete',
    closeEdited: 'closeEdited',
    confirmClose: 'confirmClose',
    move: 'move',
    saveNewLocation: 'saveNewLocation',
    focus: 'focus',
    close: 'close',
    save: 'save',
    empty: 'empty',
    lock: 'lock',
    open: 'open',
    closed: 'closed'
};

export function getUid (state) {
    return get(state, ['auth', 'user', 'uid']);
}

export function getEditorStateFromNote (note) {
    let contentState;
    if (note) {
        if (note.editorState) return note.editorState;

        try {
            contentState = convertFromRaw(note.rawMessage);
        } catch (err) {
            contentState = ContentState.createFromText(note.message || '');
        }
    }

    return contentState
        ? EditorState.createWithContent(contentState)
        : EditorState.createEmpty();
}

export const EMPTY_EDITOR_STATE = EditorState.createEmpty();
