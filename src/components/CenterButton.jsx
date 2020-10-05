import React from 'react';
import CrosshairIcon from 'react-feather/dist/icons/crosshair';
import Control from 'react-leaflet-control';

const CenterButton = ({ onClick }) => {
    const emit = () => {
        navigator.geolocation.getCurrentPosition(pos => {
            onClick([pos.coords.latitude, pos.coords.longitude]);
        });
    };

    return (
        <Control position="topleft">
            <button
                className="p-1 bg-white rounded shadow-md hover:bg-grey-lighter"
                onClick={emit}
            >
                <CrosshairIcon />
            </button>
        </Control>
    );
};

export default CenterButton;
