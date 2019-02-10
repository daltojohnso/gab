import React from 'react';
import {TextEditor} from '~/components';
import styled from 'styled-components';

const AbsolutePositioningDiv = styled.div`
    right: 20rem;
    top: calc(52px + 2rem);
`;

const FloatingTextEditor = (props) => (
    <AbsolutePositioningDiv className="absolute z-400 bg-white opacity-90 h-96 w-2/5 lg:w-1/4 shadow-md">
        <div className="relative h-96 overflow-y-auto">
            <TextEditor {...props} />
        </div>
    </AbsolutePositioningDiv>
);

export default FloatingTextEditor;
