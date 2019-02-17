import React from 'react';
import {TextEditor2} from '~/components';
import styled from 'styled-components';

const AbsolutePositioningDiv = styled.div`
    right: 5rem;
    top: 8rem;

    @media screen and (max-width: 767px) {
        right: 0;
        left: 0;
        top: 64px;
        height: calc(100% - 64px);
    }
`;

const FloatingTextEditor2 = (props) => (
    <AbsolutePositioningDiv
        className="absolute z-400 bg-white opacity-90 md:h-96 w-full md:w-2/5 lg:w-1/4 md:shadow-md">
        <div className="relative overflow-y-auto h-full md:h-96">
            <TextEditor2 {...props} />
        </div>
    </AbsolutePositioningDiv>
);

export default FloatingTextEditor2;
