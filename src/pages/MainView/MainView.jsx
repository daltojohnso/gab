import React from 'react';
import {MarkerMap} from '~/components';
import styled from 'styled-components';

const Wrapper = styled.div`
    height: 100%;
    width: 100%;
`;

class MainView extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <Wrapper>
                <MarkerMap />
            </Wrapper>
        );
    }
}

export default MainView;
