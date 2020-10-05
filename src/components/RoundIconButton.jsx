import React from 'react';
import classnames from 'classnames';

const RoundIconButton = ({ icon, className, ...props }) => {
    return (
        <button
            className={classnames(
                'w-10 h-10 hover:shadow-lg hover:bg-grey-lighter shadow-sm transition-shadow border border-black rounded-full bg-white flex justify-center items-center active:bg-black active:text-white',
                className
            )}
            {...props}
        >
            {icon}
        </button>
    );
};

export default RoundIconButton;
