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
    right: 1rem;
    top: calc(52px + 1rem);
    background-color: white;
    opacity: 0.8;
`;

class MainView extends React.Component {
    constructor() {
        super();
        this.state = {
            isEditorOpen: false
        };
    }

    onNewMarker(position) {
        this.setState({
            isEditorOpen: true,
            position
        });
    }

    render() {
        const {isEditorOpen} = this.state;
        return (
            <Wrapper>
                <MarkerMap onNewMarker={this.onNewMarker.bind(this)} />
                {isEditorOpen && (
                    <FloatyWrapper>
                        <TextEditor />
                    </FloatyWrapper>
                )}
            </Wrapper>
        );
    }
}

export default MainView;
