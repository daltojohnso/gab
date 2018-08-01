import React from 'react';
import {MarkerMap} from '~/components';

class MainView extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div style={{height: '100%', width: '100%'}}>
                <MarkerMap />
            </div>
        );
    }
}

export default MainView;
