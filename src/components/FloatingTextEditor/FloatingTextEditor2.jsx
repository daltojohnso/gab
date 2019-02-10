import React from 'react';
import {TextEditor2} from '~/components';
import styled from 'styled-components';

const AbsolutePositioningDiv = styled.div`
    right: 5rem;
    top: 8rem;
`;

const FloatingTextEditor2 = (props) => (
    <AbsolutePositioningDiv className="absolute z-400 bg-white opacity-90 h-96 w-2/5 lg:w-1/4 shadow-md">
        <div className="relative h-96 overflow-y-auto">
            <TextEditor2 {...props} />
        </div>
    </AbsolutePositioningDiv>
);

export default FloatingTextEditor2;
