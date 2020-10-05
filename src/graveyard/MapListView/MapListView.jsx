import React from 'react';

class MapListView extends React.Component {
    componentDidMount () {
        this.props.fetchMaps();
    }

    render () {
        const maps = this.props.maps;
        return (
            <main>
                {maps.map(map => <div>{map.id}</div>)}
            </main>
        );
    }
}

export default MapListView;
