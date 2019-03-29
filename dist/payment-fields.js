import _Object$keys from 'babel-runtime/core-js/object/keys';
import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import PropTypes from 'prop-types';
import Vendors from './vendors';
import Field from './field.jsx';

var PaymentFields = function (_React$Component) {
    _inherits(PaymentFields, _React$Component);

    function PaymentFields(props) {
        _classCallCheck(this, PaymentFields);

        var _this = _possibleConstructorReturn(this, (PaymentFields.__proto__ || _Object$getPrototypeOf(PaymentFields)).call(this, props));

        var Api = Vendors[props.vendor];
        _this.api = new Api(props);
        return _this;
    }

    _createClass(PaymentFields, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.api.setAuthorization(this.props.authorization);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.api.teardown();
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            this.api.setAuthorization(nextProps.authorization);
        }
    }, {
        key: 'tokenize',
        value: function tokenize(options) {
            return this.api.tokenize(options);
        }
    }, {
        key: 'getChildContext',
        value: function getChildContext() {
            return { paymentFieldsApi: this.api };
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props,
                providedClass = _props.className,
                Tag = _props.tagName;

            var className = 'payment-fields-wrapper';
            if (providedClass) {
                className += ' ' + providedClass;
            }
            return React.createElement(
                Tag,
                { className: className },
                this.props.children
            );
        }
    }]);

    return PaymentFields;
}(React.Component);

PaymentFields.Field = Field;
PaymentFields.propTypes = {
    vendor: PropTypes.oneOf(_Object$keys(Vendors)).isRequired,
    children: PropTypes.node.isRequired,
    onReady: PropTypes.func,
    authorization: PropTypes.string,
    onValidityChange: PropTypes.func,
    onCardTypeChange: PropTypes.func,
    onError: PropTypes.func,
    passThroughStyles: PropTypes.any,
    styles: PropTypes.object,
    className: PropTypes.string,
    tagName: PropTypes.string
};
PaymentFields.defaultProps = {
    tagName: 'div',
    styles: {}
};
PaymentFields.childContextTypes = {
    paymentFieldsApi: PropTypes.object
};
export default PaymentFields;