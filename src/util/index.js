import isArray from 'lodash/isArray';

export function bindAll(_this, fns = []) {
    fns.forEach(props => {
        if (isArray(props)) {
            const fnName = props.shift();
            _this[fnName] = _this[fnName].bind(_this, ...props);
        } else {
            _this[props] = _this[props].bind(_this);
        }
    });
}
