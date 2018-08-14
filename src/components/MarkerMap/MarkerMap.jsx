import React from 'react';
import PropTypes from 'prop-types';
import {Map, TileLayer, Marker} from 'react-leaflet';
import {bindAll} from '~/util';
import {GeoPoint} from '~/firebase';
import styled from 'styled-components';
import values from 'lodash/values';

import L from 'leaflet';
// const icon = L.divIcon({className: 'marker-map--div-icon'});
const icon = L.divIcon();
const MapWrapper = styled.div`
    height: 100%;
    width: 100%;

    .marker-map--div-icon {
        &::before {
            font-size: 1.5rem;
            content: '🌚';
        }

        ${props =>
        props.users
                .map(user => {
                return `
                            &--${user.uid} {
                                &::before {
                                    font-size: 1.5rem;
                                    content: '${user.icon}';
                                }
                            }
                        `;
                })
            .join('\n')};
    }
`;

// https://www.npmjs.com/package/react-leaflet-div-icon
// https://www.npmjs.com/package/react-leaflet-locate-control
// https://yuzhva.github.io/react-leaflet-markercluster/
// https://github.com/smeijer/leaflet-geosearch/blob/develop/src/providers/openStreetMapProvider.js
// https://react-leaflet.js.org/docs/en/custom-components.html

// https://www.npmjs.com/package/is-mobile for disabling movement
class MarkerMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            position: [0, 0],
            zoom: 3
        };

        this.mapRef = React.createRef();
        bindAll(this, ['onViewportChange', 'onClick']);
    }

    // TODO: normalize lat, lng for super-far-away map clicks
    onClick(e) {
        const {lat, lng} = e.latlng;
        const position = [lat, lng];
        this.props.onMapClick(new GeoPoint(...position));
        this.setState({
            position
        });
    }

    onMarkerClick(id, position) {
        this.props.onMarkerSelect(id);
        this.setState({position});
    }

    createMarker(note, usersById, fakeId) {
        const {
            id,
            createdBy,
            location: {latitude, longitude}
        } = note;
        const position = [latitude, longitude];
        const user = usersById[createdBy];
        const className = user
            ? `marker-map--div-icon--${user.uid}`
            : 'marker-map--div-icon';

        const icon = L.divIcon({className});
        return (
            <Marker
                icon={icon}
                key={id || fakeId}
                position={position}
                onClick={() => this.onMarkerClick(id, position)}
            />
        );
    }

    onViewportChange({zoom}) {
        this.setState({zoom});
    }

    render() {
        const {position, zoom} = this.state;
        const {selectedNote, notes, usersById} = this.props;

        const pendingMarker =
            selectedNote && !selectedNote.id
                ? this.createMarker(selectedNote, usersById, 'pending-marker')
                : null;

        const markers = notes.map(note => this.createMarker(note, usersById));
        return (
            // no -- you can't use styled(Map).
            <MapWrapper users={values(usersById)}>
                <Map
                    animate={true}
                    style={{height: '100%', width: '100%'}}
                    center={position}
                    zoom={zoom}
                    worldCopyJump={true}
                    ref={this.mapRef}
                    onViewportChange={this.onViewportChange}
                    onClick={this.onClick}
                >
                    <TileLayer
                        attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {pendingMarker}
                    {markers}
                </Map>
            </MapWrapper>
        );
    }
}

MarkerMap.propTypes = {
    notes: PropTypes.arrayOf(PropTypes.object),
    usersById: PropTypes.object,
    selectedNote: PropTypes.object,
    onMapClick: PropTypes.func,
    onMarkerSelect: PropTypes.func,
    position: PropTypes.array
};

const noop = () => {};
MarkerMap.defaultProps = {
    notes: [],
    usersById: {},
    onMapClick: noop,
    onMarkerSelect: noop
};

export default MarkerMap;
