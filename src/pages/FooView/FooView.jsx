import React from 'react';
import {FloatingTextEditor, FloatingTextEditor2} from '~/components';

class FooView extends React.Component {
    render () {
        return (
            <main>
                <FloatingTextEditor2 />
                <FloatingTextEditor />
            </main>
        );
    }
}

export default FooView;
