import React from 'react';
import {FooterItem, LoaderFooter} from './Components.jsx';
import PropTypes from 'prop-types';
import get from 'lodash/get';

class Footer extends React.PureComponent {
    constructor (props) {
        super(props);

        const hoverEditButton = <FooterItem>Edit?</FooterItem>;
        const hoverCloseButton = <FooterItem>Close note?</FooterItem>;
        const hoverCancelButton = <FooterItem>Discard changes?</FooterItem>;
        const hoverDeleteButton = <FooterItem>Delete note?</FooterItem>;
        const hoverMoveButton = <FooterItem>Move note?</FooterItem>;

        const rejectedFooter = (
            <FooterItem link onClick={() => this.props.onClick('editing')}>
               Saving failed. Try again?
            </FooterItem>
        );

        const saveButton = (
            <FooterItem link onClick={() => this.props.onClick('editing')}>
                Save
            </FooterItem>
        );

        const saveMove = (
            <FooterItem link onClick={() => this.props.onClick('moving')}>
                Save New Location
            </FooterItem>
        );

        const confirmCancel = (
            <FooterItem link onClick={() => this.props.onClick('cancel')}>
                Are you sure you want to discard changes?
            </FooterItem>
        );

        const confirmDelete = (
            <FooterItem link onClick={() => this.props.onClick('delete')}>
                Are you sure you want to delete this note?
            </FooterItem>
        );

        this.footerMap = {
            readOnly: null,
            editing: saveButton,
            cancel: confirmCancel,
            delete: confirmDelete,
            moving: saveMove,

            editingOverride: hoverEditButton,
            cancelOverride: hoverCancelButton,
            closeOverride: hoverCloseButton,
            deleteOverride: hoverDeleteButton,
            movingOverride: hoverMoveButton,

            loading: <LoaderFooter />,
            rejected: rejectedFooter
        };
    }

    buildDefaultFooter (name) {
        return name
            ? <FooterItem>{name && <i>from {name}</i>}</FooterItem>
            : <FooterItem>&nbsp;</FooterItem>;
    }

    render () {
        const {base, override, createdBy} = this.props;
        const mode = override ? `${override}Override` : base;
        const name = get(createdBy, 'displayName') || get(createdBy, 'email');
        const defaultFooter = this.buildDefaultFooter(name);
        return (
            <footer className="card-footer">
                {this.footerMap[mode] || defaultFooter}
            </footer>
        );
    }
}

Footer.propTypes = {
    base: PropTypes.string,
    override: PropTypes.string,
    onClick: PropTypes.func,
    createdBy: PropTypes.object
};

export default Footer;
