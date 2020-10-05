// import React, { useState, useEffect, useMemo, useCallback } from 'react';
// import { NavBar, MarkerMap, FloatingTextEditor2 } from '~/components';
// import { EDITOR_STATES } from '~/util';
// import { useSelector, useDispatch } from 'react-redux';
// import { fetchMap } from '~/store/actions/maps';
// import { saveNote, deleteNote } from '~/store/actions/notes';
// import {useParams} from 'react-router-dom';
// import values from 'lodash/values';
//
// function getIconColor (userId, userMap) {
//     return userMap[userId] ? userMap[userId] : 'gray';
// }
//
// function useFilteredNotes (mapId) {
//     const notesById = useSelector(state => state.notes.byId);
//     const usersById = useSelector(state => state.users.byId);
//
//     const getNote = useCallback(id => {
//         return notesById[id];
//     }, [notesById]);
//
//     const notes = useMemo(
//         () => values(notesById)
//             .filter(note => note.mapId === mapId)
//             .map(note => ({
//                 ...note,
//                 iconColor: getIconColor(note.createdBy, usersById)
//             })),
//         [notesById, usersById, mapId]
//     );
//
//     return [notes, getNote];
// }
//
// const MainView = () => {
//     const dispatch = useDispatch();
//     const [selectedNote, setSelectedNote] = useState(undefined);
//     const [editorState, setEditorState] = useState(EDITOR_STATES.closed);
//     const usersResolved = useSelector(state => state.users.status === 'resolved');
//     const noteStatus = useSelector(state => state.notes.status);
//     const {mapId} = useParams();
//     const map = useSelector(state => state.maps.byId[mapId]);
//     const user = useSelector(state => state.auth.user);
//
//     const [notes, getNote] = useFilteredNotes(mapId);
//
//     useEffect(() => {
//         dispatch(fetchMap(mapId));
//     }, [dispatch, mapId]);
//
//     const onMarkerClick = id => {
//         if (
//             editorState === EDITOR_STATES.edit ||
//                 editorState === EDITOR_STATES.move
//         )
//             return;
//
//         setSelectedNote(getNote(id));
//         setEditorState(EDITOR_STATES.open);
//     };
//
//     const onMapClick = location => {
//         if (!usersResolved) return;
//
//         switch (editorState) {
//             case EDITOR_STATES.move:
//                 setSelectedNote({
//                     ...selectedNote,
//                     location
//                 });
//                 break;
//             case EDITOR_STATES.edit:
//                 if (!selectedNote.id) {
//                     setSelectedNote({
//                         ...selectedNote,
//                         location
//                     });
//                 }
//                 break;
//             default:
//                 setSelectedNote({
//                     location,
//                     createdBy: user.uid
//                 });
//                 setEditorState(EDITOR_STATES.edit);
//         }
//     };
//
//     const onNoteChange = async (state, messageProps = {}) => {
//         switch (state) {
//             case EDITOR_STATES.edit:
//                 setSelectedNote({
//                     ...selectedNote,
//                     editorState: messageProps.editorState
//                 });
//                 break;
//             case EDITOR_STATES.save:
//                 dispatch(
//                     saveNote(mapId, {
//                         ...selectedNote,
//                         ...messageProps
//                     })
//                 );
//                 break;
//             case EDITOR_STATES.move:
//                 setEditorState(EDITOR_STATES.move);
//                 break;
//             case EDITOR_STATES.confirmDelete:
//                 dispatch(deleteNote(selectedNote.id));
//                 setSelectedNote(undefined);
//                 setEditorState(EDITOR_STATES.closed);
//                 break;
//             case EDITOR_STATES.confirmClose:
//                 setSelectedNote(undefined);
//                 setEditorState(EDITOR_STATES.closed);
//                 break;
//             case EDITOR_STATES.focus:
//                 break;
//         }
//     };
//
//     return (
//         <>
//             <NavBar header={'maps' + (!map ? '' : ` / ${map.name}`)} />
//             <main className="w-full h-full">
//                 {selectedNote && (
//                     <FloatingTextEditor2
//                         onChange={onNoteChange}
//                         note={selectedNote}
//                         noteStatus={noteStatus}
//                     />
//                 )}
//                 <MarkerMap
//                     onMapClick={onMapClick}
//                     onMarkerClick={onMarkerClick}
//                     selectedMarker={selectedNote}
//                     markers={notes}
//                 />
//             </main>
//         </>
//     );
// };
//
// export default MainView;
