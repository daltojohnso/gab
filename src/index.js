import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {App} from '~/pages';
import store from './store';
import './firebase';
import 'bulma/css/bulma.css';
import 'leaflet/dist/leaflet.css';

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app')
);

// eslint-disable-next-line no-undef
module.hot && module.hot.accept();
