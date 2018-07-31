import React from 'react';
import {Map, TileLayer} from 'react-leaflet';

export default class Foo extends React.Component {
    constructor() {
        super();
        this.state = {
            zoom: 13
        };
    }

    render() {
        const position = [35.910828, -78.426277];
        return (
            <div style={{height: '500px', width: '500px'}}>
                <Map
                    style={{height: '100%', width: '100%'}}
                    center={position}
                    zoom={this.state.zoom}
                >
                    <TileLayer
                        attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                </Map>
            </div>
        );
    }
}
