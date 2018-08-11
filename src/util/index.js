import isArray from 'lodash/isArray';
import isPlainObject from 'lodash/isPlainObject';
import toPairs from 'lodash/toPairs';
import get from 'lodash/get';

// this could be better
export function bindAll(_this, fns = []) {
    fns.forEach(fn => {
        if (isArray(fn)) {
            const fnName = fn.shift();
            _this[fnName] = _this[fnName].bind(_this, ...fn);
        } else if (isPlainObject(fn)) {
            toPairs(fn).forEach(([key, value]) => {
                _this[key] = isArray(value)
                    ? get(_this, value.shift()).bind(_this, ...value)
                    : get(_this, value).bind(_this);
            });
        } else {
            _this[fn] = _this[fn].bind(_this);
        }
    });
}
