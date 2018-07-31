import React from 'react';
import PropTypes from 'prop-types';

const Hero = props => (
    <section className="hero is-dark is-bold">
        <div className="hero-body">
            <div className="container has-text-centered">
                <h1 className="title">{props.title}</h1>
                <h2 className="subtitle" />
            </div>
        </div>
    </section>
);
Hero.propTypes = {
    title: PropTypes.string
};

export default Hero;
