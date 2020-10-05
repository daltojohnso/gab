import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchMap } from '~/store/actions/maps';
import NavBar from '~/components/NavBar.jsx';
import Editor from '~/components/Editor.jsx';
import MarkerMap from '~/components/MarkerMap.jsx';
import values from 'lodash/values';
import { getEditorStateFromNote } from '~/util';
import RoundIconButton from '~/components/RoundIconButton.jsx';
import ArrowLeftIcon from 'react-feather/dist/icons/arrow-left';
import ArrowRightIcon from 'react-feather/dist/icons/arrow-right';
import ShuffleIcon from 'react-feather/dist/icons/shuffle';
import PlusIcon from 'react-feather/dist/icons/plus';
import ListIcon from 'react-feather/dist/icons/list';
import NoteList from '~/components/NoteList.jsx';

function useFilteredNotes (mapId) {
    const notesById = useSelector(state => state.notes.byId);
    const usersById = useSelector(state => state.users.byId);

    const getNote = useCallback(
        id => {
            return notesById[id];
        },
        [notesById]
    );

    const notes = useMemo(
        () =>
            values(notesById)
                .filter(note => note.mapId === mapId)
                .map(note => ({
                    ...note,
                    iconColor: usersById[note.createdBy]
                        ? usersById[note.createdBy]
                        : 'gray'
                })),
        [notesById, usersById, mapId]
    );

    return [notes, getNote];
}

function useMap (mapId) {
    const dispatch = useDispatch();
    const map = useSelector(state => state.maps.byId[mapId]);

    useEffect(() => {
        dispatch(fetchMap(mapId));
    }, [dispatch, mapId]);

    return map;
}

const MapView = () => {
    const { mapId, noteId } = useParams();
    const [notes, getNote] = useFilteredNotes(mapId);
    const [selectedNote, setSelectedNote] = useState(getNote(noteId));
    const map = useMap(mapId);
    const [isEditingNote, setIsEditingNote] = useState(false);
    const editorState = useMemo(() => {
        return getEditorStateFromNote(selectedNote);
    }, [selectedNote]);

    useEffect(() => {
        setSelectedNote(getNote(noteId));
    }, [noteId, getNote]);

    const onEditorStateChange = editorState => {
        setSelectedNote({
            ...selectedNote,
            editorState
        });
    };

    const onMapClick = location => {
        if (selectedNote.id && !isEditingNote) return;

        setIsEditingNote(true);
        setSelectedNote({
            ...(selectedNote ? {} : selectedNote),
            location
        });
    };

    return (
        <>
            <NavBar header={'maps' + (!map ? '' : ` / ${map.name}`)} />
            <main className="w-full flex-1 flex flex-col overflow-auto">
                <div className="relative h-auto flex-1 bg-grey-dark">
                    <MarkerMap
                        onMapClick={onMapClick}
                        selectedMarker={selectedNote}
                        markers={notes}
                    />
                </div>
                <div className="w-auto flex flex-col border-r-1 shadow-lg">
                    <div className="flex flex-shrink-0 border-b-2 shadow-md">
                        <RoundIconButton
                            className="m-2"
                            icon={<ArrowLeftIcon />}
                        />
                        <RoundIconButton
                            className="m-2"
                            icon={<ArrowRightIcon />}
                        />
                        <RoundIconButton
                            className="m-2"
                            icon={<ShuffleIcon />}
                        />
                        <RoundIconButton className="m-2" icon={<PlusIcon />} />
                        <RoundIconButton className="m-2" icon={<ListIcon />} />
                    </div>
                    <NoteList
                        className="mx-2 flex overflow-x-auto"
                        notes={notes}
                    />
                </div>
            </main>
        </>
    );

    // <Editor
    //     editorState={editorState}
    //     onChange={onEditorStateChange}
    // ></Editor>
};

export default MapView;
