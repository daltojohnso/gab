import React from 'react';
import NoteEditor from '~/components/NoteEditor.jsx';
import NavBar from '~/components/NavBar.jsx';
// <Sidebar className="top-auto relative h-full w-2/5 lg:w-1/3 xl:w-1/4" />

const FooView = () => {
    return (
        <>
            <NavBar header="foo" />
            <main className="w-full flex-1 flex flex-row overflow-auto">
                <div className="relative h-auto flex-1 bg-grey-dark">map</div>
                <div className="h-full w-2/5">
                    <NoteEditor></NoteEditor>
                </div>
            </main>
        </>
    );
};

export default FooView;
