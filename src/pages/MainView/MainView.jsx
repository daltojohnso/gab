import React from 'react';
import {MarkerMap, TextEditor} from '~/components';
import styled from 'styled-components';

const Wrapper = styled.div`
    height: 100%;
    width: 100%;
`;

const FloatyWrapper = styled.div`
    position: absolute;
    z-index: 499;
    right: 2rem;
    top: calc(52px + 2rem);
    background-color: white;
    opacity: 0.9;

    min-height: 30rem;
    max-height: 30rem;
    min-width: 30rem;
    max-width: 30rem;
`;

const FloatyInner = styled.div`
    position: relative;
    height: 30rem;
    overflow-y: auto;
`;

const Floater = ({children}) => (
    <FloatyWrapper>
        <FloatyInner>
            {children}
        </FloatyInner>
    </FloatyWrapper>
);

class MainView extends React.Component {
    constructor() {
        super();
        this.state = {
            isEditorOpen: false,
            position: null
        };
    }

    onNewMarker(position) {
        this.setState({
            isEditorOpen: true,
            position
        });
    }

    onCancel() {
        this.setState({
            isEditorOpen: false
        });
    }

    onSave(note) {
        // dispatch action to save Note
        this.setState({
            isEditorOpen: false
        });
    }

    render() {
        const {isEditorOpen} = this.state;
        return (
            <Wrapper>
                <MarkerMap onNewMarker={this.onNewMarker.bind(this)} />
                {isEditorOpen && (
                    <Floater>
                        <TextEditor
                            onCancel={this.onCancel.bind(this)}
                            onSave={this.onSave.bind(this)}
                        />
                    </Floater>
                )}
            </Wrapper>
        );
    }
}

export default MainView;
