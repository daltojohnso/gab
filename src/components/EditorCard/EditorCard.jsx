// import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
// import EditIcon from 'react-feather/dist/icons/edit';
// import TrashIcon from 'react-feather/dist/icons/trash-2';
// import XIcon from 'react-feather/dist/icons/x';
// import {Editor, EditorState, RichUtils} from 'draft-js';
// import 'draft-js/dist/Draft.css';
//
// const Card = styled.div`
//     height: 100%;
//     display: flex;
//     flex-direction: column;
//     justify-content: space-between;
// `;
//
// const CardContent = styled.div`
//     flex: 1;
//
//     > .DraftEditor-root {
//         height: 100%;
//     }
// `;
//
// const FooterItem = ({link, children, ...props}) => {
//     return link ? (
//         <a {...props} href="#" className="card-footer-item">
//             {children}
//         </a>
//     ) : (
//         <div {...props} className="card-footer-item">
//             {children}
//         </div>
//     );
// };
//
// const Icon = ({label, children, ...props}) => (
//     <a {...props} href="#" aria-label={label} className="card-header-icon">
//         <span className="icon">{children}</span>
//     </a>
// );
//
// class TextEditor extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             editMode: props.initialText ? 'readOnly' : 'edit',
//             buttonMode: 'default',
//             hoverMode: null,
//             confirmDeleteOrCancel: false,
//             mode: 'readOnly',
//             editorState: EditorState.createEmpty()
//         };
//
//         this.confirm = {
//             readOnly: 'delete',
//             edit: 'cancel'
//         };
//
//         this.hoverEditButton = <FooterItem>Edit?</FooterItem>;
//         this.hoverCloseButton = <FooterItem>Close note?</FooterItem>;
//         this.hoverCancelButton = <FooterItem>Discard changes?</FooterItem>;
//         this.hoverDeleteButton = <FooterItem>Delete note?</FooterItem>;
//
//         this.confirmDelete = (
//             <FooterItem link>
//                 Are you sure you want to delete this note?
//             </FooterItem>
//         );
//         this.confirmCancel = (
//             <FooterItem link>
//                 Are you sure you want to discard changes?
//             </FooterItem>
//         );
//         this.saveButton = <FooterItem link onClick={() => this.onSave(this.state.editorState)}>Save</FooterItem>;
//
//         this.states = {
//             readOnly: {
//                 default: <FooterItem>&nbsp;</FooterItem>,
//                 hoverEdit: this.hoverEditButton,
//                 hoverClose: this.hoverCloseButton,
//                 hoverDelete: this.hoverDeleteButton,
//
//                 confirmDelete: this.confirmDelete
//             },
//             edit: {
//                 default: this.saveButton,
//                 hoverEdit: this.saveButton,
//                 hoverClose: this.hoverCancelButton,
//                 hoverDelete: this.hoverDeleteButton,
//
//                 confirmCancel: this.confirmCancel,
//                 confirmDelete: this.confirmDelete
//             }
//         };
//     }
//
//     onChange(editorState) {
//         this.setState({
//             editorState
//         });
//     }
//
//     buildFooter(editMode, hoverMode, buttonMode) {
//         return buttonMode === 'default'
//             ? this.states[editMode][hoverMode || buttonMode]
//             : this.states[editMode][buttonMode];
//     }
//
//     setEditMode(mode) {
//         this.setState({
//             editMode: mode
//         });
//     }
//
//     setButtonMode(mode, returnToDefault) {
//         this.setState({
//             buttonMode: mode
//         });
//         if (returnToDefault) {
//             clearTimeout(this.currentTimer);
//             this.currentTimer = setTimeout(() => {
//                 this.setState({
//                     buttonMode: 'default'
//                 });
//             }, 3000);
//         }
//     }
//
//     setHoverMode(mode) {
//         this.setState({
//             hoverMode: mode
//         });
//     }
//
//     onClose() {
//         if (this.state.editMode === 'readOnly') {
//             // this.onClose() for reals
//         } else {
//             this.setButtonMode('confirmCancel', true);
//         }
//     }
//
//     // onSave() {}
//     onCancel() {}
//     onDelete() {}
//     onConfirmCancel() {}
//     onConfirmDelete() {}
//
//     // https://wiki.openstreetmap.org/wiki/Nominatim#Reverse_Geocoding maybe?
//     render() {
//         const {editMode, buttonMode, hoverMode, editorState} = this.state;
//         const {initialText} = this.props;
//         return (
//             <Card className="card">
//                 <div className="card-header">
//                     <p className="card-header-title">
//                         {initialText ? '' : 'New Note'}
//                     </p>
//                     <Icon
//                         onClick={() => this.setEditMode('edit')}
//                         onMouseOver={() => this.setHoverMode('hoverEdit')}
//                         onMouseOut={() => this.setHoverMode()}
//                     >
//                         <EditIcon />
//                     </Icon>
//                     <a
//                         href="#"
//                         aria-label="Delete"
//                         className="card-header-icon"
//                         onMouseOver={() => this.setHoverMode('hoverDelete')}
//                         onMouseOut={() => this.setHoverMode()}
//                         onClick={() =>
//                             this.setButtonMode('confirmDelete', true)
//                         }
//                     >
//                         <span className="icon">
//                             <TrashIcon />
//                         </span>
//                     </a>
//                     <a
//                         href="#"
//                         aria-label="Close"
//                         className="card-header-icon"
//                         onMouseOver={() => this.setHoverMode('hoverClose')}
//                         onMouseOut={() => this.setHoverMode()}
//                         onClick={() => this.onClose()}
//                     >
//                         <span className="icon">
//                             <XIcon />
//                         </span>
//                     </a>
//                 </div>
//                 <CardContent className="card-content">
//                     <Editor
//                         readOnly={editMode === 'readOnly'}
//                         editorState={editorState}
//                         onChange={this.onChange.bind(this)}
//                     />
//                 </CardContent>
//                 <footer className="card-footer">
//                     {this.buildFooter(editMode, hoverMode, buttonMode)}
//                 </footer>
//             </Card>
//         );
//     }
// }
//
// TextEditor.propTypes = {
//     initialText: PropTypes.string,
//     onSave: PropTypes.func
// };
//
// export default TextEditor;
