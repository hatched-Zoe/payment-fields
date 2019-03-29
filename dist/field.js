import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';

var Field = function (_React$Component) {
    _inherits(Field, _React$Component);

    function Field() {
        _classCallCheck(this, Field);

        return _possibleConstructorReturn(this, (Field.__proto__ || _Object$getPrototypeOf(Field)).apply(this, arguments));
    }

    _createClass(Field, [{
        key: 'focus',
        value: function focus() {
            this.context.paymentFieldsApi.focusField(this.props.type);
        }
    }, {
        key: 'clear',
        value: function clear() {
            this.context.paymentFieldsApi.clearField(this.props.type);
        }
    }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.fieldId = this.context.paymentFieldsApi.checkInField(this.props);
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement('div', { id: this.fieldId, className: this.className });
        }
    }, {
        key: 'className',
        get: function get() {
            var list = ['payment-field'];
            if (this.props.className) {
                list.push(this.props.className);
            }
            return list.join(' ');
        }
    }]);

    return Field;
}(React.Component);

Field.propTypes = {
    type: PropTypes.oneOf(['cardNumber', 'expirationDate', 'cvv', 'postalCode']).isRequired,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    onValidityChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func
};
Field.defaultProps = {
    placeholder: ''
};
Field.contextTypes = {
    paymentFieldsApi: PropTypes.object
};
export default Field;