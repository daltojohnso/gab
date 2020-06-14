import React, { useState, useEffect } from 'react';
import { NavBar, MarkerMap, FloatingTextEditor2 } from '~/components';
import { EDITOR_STATES } from '~/util';
import { useSelector, useDispatch, batch } from 'react-redux';
import {
    fetchMap,
    fetchFirstMapAndNotes,
    setSelectedMap
} from '~/store/actions/maps';
import { fetchNotes, saveNote, deleteNote } from '~/store/actions/notes';
import { fetchUsersOfMap } from '~/store/actions/users';
import filter from 'lodash/filter';
import values from 'lodash/values';

const STATES = {
    open: 'open',
    editing: 'editing',
    moving: 'moving'
};

const MainView = () => {
    const [selectedNote, setSelectedNote] = useState(undefined);
    const [editorState, setEditorState] = useState(undefined);
    const dispatch = useDispatch();
    const isLoading = useSelector(state => state.nav.status === 'loading');
    const noteStatus = useSelector(state => state.notes.status);
    const selectedMapId = useSelector(state => state.maps.selectedMapId);
    const notes = useSelector(state =>
        filter(values(state.notes.byId), { mapId: state.maps.selectedMapId })
    );
    const usersById = useSelector(state => state.users.byId);
    const user = useSelector(state => state.auth.user);
    const pinMap = useSelector(state => state.auth.user.isAnon === true);

    useEffect(() => {
        if (!selectedMapId) {
            dispatch(fetchFirstMapAndNotes());
        } else {
            batch(() => {
                dispatch(setSelectedMap(selectedMapId));
                dispatch(fetchMap(selectedMapId)).then(() => {
                    batch(() => {
                        dispatch(fetchUsersOfMap(selectedMapId));
                        dispatch(fetchNotes(selectedMapId));
                    });
                });
            });
        }
    }, [dispatch, selectedMapId]);

    const onMapClick = location => {
        if (isLoading) return;

        if (editorState === STATES.moving) {
            setSelectedNote({
                ...selectedNote,
                location
            });
        } else if (editorState !== STATES.editing) {
            setSelectedNote({
                location,
                createdBy: user.uid
            });
            setEditorState(STATES.open);
        }
    };

    const onMarkerClick = id => {
        if (editorState === STATES.editing || editorState === STATES.moving)
            return;

        const selectedNote = notes.find(note => note.id === id);
        setSelectedNote(selectedNote);
        setEditorState(STATES.open);
    };

    const closeEditor = () => {
        setSelectedNote(undefined);
        setEditorState(undefined);
    };

    const onSave = async messageProps => {
        await dispatch(
            saveNote(selectedMapId, {
                ...selectedNote,
                ...messageProps
            })
        );

        if (editorState !== STATES.moving) {
            closeEditor();
        }
    };

    const onDelete = async () => {
        dispatch(deleteNote(selectedNote.id));
        closeEditor();
    };

    const onNoteChange = (state, messageProps = {}) => {
        switch (state) {
            case EDITOR_STATES.save:
                onSave(messageProps);
                break;
            case EDITOR_STATES.move:
                setEditorState(STATES.moving);
                break;
            case EDITOR_STATES.confirmDelete:
                onDelete();
                break;
            case EDITOR_STATES.confirmClose:
                closeEditor();
                break;
            case EDITOR_STATES.focus:
                break;
        }
    };

    const openMapsList = () => {};
    const openNotesList = () => {};

    return (
        <>
            <NavBar onMapsClick={openMapsList} onNotesClick={openNotesList} />
            <main className="w-full h-full">
                <MarkerMap
                    onMapClick={onMapClick}
                    onMarkerClick={onMarkerClick}
                    selectedNote={selectedNote}
                    notes={notes}
                    usersById={usersById}
                    pinMap={pinMap}
                />
                {selectedNote && (
                    <FloatingTextEditor2
                        onChange={onNoteChange}
                        note={selectedNote}
                        noteStatus={noteStatus}
                    />
                )}
            </main>
        </>
    );
};

export default MainView;
