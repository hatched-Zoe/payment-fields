import _Promise from 'babel-runtime/core-js/promise';
import _Object$keys from 'babel-runtime/core-js/object/keys';
import _createClass from 'babel-runtime/helpers/createClass';
import _get from 'babel-runtime/helpers/get';
import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import _Object$assign from 'babel-runtime/core-js/object/assign';
import Api from './api';

// sandbox_g42y39zw_348pk9cgf3bgyw2b

export var EVENTS_MAP = {
    focus: 'onFocus',
    blur: 'onBlur',
    validityChange: 'onValidityChange',
    cardTypeChange: 'onCardTypeChange'
};

var EVENT_DECODERS = {
    onCardTypeChange: function onCardTypeChange(event) {
        var card = 1 === event.cards.length ? event.cards[0] : {};
        return _Object$assign(card, { type: 'onCardTypeChange', brand: card.type });
    }
};

export var TYPES_MAP = {
    cardNumber: 'number'
};

export var BraintreeField = function (_Api$Field) {
    _inherits(BraintreeField, _Api$Field);

    function BraintreeField(api, props) {
        _classCallCheck(this, BraintreeField);

        var _this = _possibleConstructorReturn(this, (BraintreeField.__proto__ || _Object$getPrototypeOf(BraintreeField)).call(this, api, props));

        _this.type = TYPES_MAP[_this.type] || _this.type;
        _this.options.selector = '#' + _this.id;
        return _this;
    }

    return BraintreeField;
}(Api.Field);

var BraintreeApi = function (_Api) {
    _inherits(BraintreeApi, _Api);

    function BraintreeApi(props) {
        _classCallCheck(this, BraintreeApi);

        var _this2 = _possibleConstructorReturn(this, (BraintreeApi.__proto__ || _Object$getPrototypeOf(BraintreeApi)).call(this, {
            props: props,
            isReady: !!global.braintree,
            urls: ['https://js.braintreegateway.com/web/3.43.0/js/client.min.js', 'https://js.braintreegateway.com/web/3.43.0/js/hosted-fields.min.js']
        }));

        _this2.FieldClass = BraintreeField;
        return _this2;
    }

    _createClass(BraintreeApi, [{
        key: 'isApiReady',
        value: function isApiReady() {
            return !!global.braintree;
        }
    }, {
        key: 'createInstance',
        value: function createInstance() {
            var _this3 = this;

            global.braintree.client.create({ authorization: this.authorization }, function (err, clientInstance) {
                if (err) {
                    _this3.onError(err);
                } else {
                    _this3.createFields(clientInstance);
                }
            });
        }
    }, {
        key: 'createFields',
        value: function createFields(client) {
            var _this4 = this;

            var fields = {};
            _Object$keys(this.fields).forEach(function (fieldName) {
                fields[fieldName] = _this4.fields[fieldName].options;
            });
            global.braintree.hostedFields.create({
                client: client,
                fields: fields,
                styles: {
                    input: this.styles.base,
                    ':focus': this.styles.focus,
                    '.invalid': this.styles.invalid,
                    '.valid': this.styles.valid
                }
            }, function (err, hostedFields) {
                if (err) {
                    _this4.onError(err);
                    return;
                }
                _this4.hostedFields = hostedFields;
                ['blur', 'focus', 'empty', 'notEmpty', 'cardTypeChange', 'validityChange'].forEach(function (eventName) {
                    hostedFields.on(eventName, function (ev) {
                        return _this4.onFieldEvent(eventName, ev);
                    });
                });
                _this4.onFieldsReady();
            });
        }
    }, {
        key: 'onFieldEvent',
        value: function onFieldEvent(eventName, event) {
            var type = EVENTS_MAP[eventName] || eventName;
            var attrs = EVENT_DECODERS[type] ? EVENT_DECODERS[type](event) : {};
            var field = this.fields[TYPES_MAP[event.emittedBy] || event.emittedBy];
            var sanitizedEvent = _Object$assign({
                field: field.props.type,
                type: type,
                event: event,
                isPotentiallyValid: event.fields[event.emittedBy].isPotentiallyValid,
                isValid: event.fields[event.emittedBy].isValid
            }, attrs);
            field.emit(sanitizedEvent);

            if ('validityChange' === eventName) {
                var isValid = true;
                var fields = _Object$keys(event.fields);
                for (var fi = 0; fi < fields.length; fi++) {
                    isValid = Boolean(event.fields[fields[fi]].isValid);
                    if (!isValid) {
                        break;
                    }
                }
                this.onFieldValidity(_Object$assign(sanitizedEvent, { isValid: isValid }));
            } else {
                _get(BraintreeApi.prototype.__proto__ || _Object$getPrototypeOf(BraintreeApi.prototype), 'onFieldEvent', this).call(this, sanitizedEvent);
            }
        }
    }, {
        key: 'tokenize',
        value: function tokenize() {
            var _this5 = this;

            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            return new _Promise(function (resolve, reject) {
                _this5.hostedFields.tokenize(options, function (err, payload) {
                    if (err) {
                        _this5.onError(err);
                        reject(err);
                    } else {
                        resolve({ token: payload });
                    }
                });
            });
        }
    }, {
        key: 'teardown',
        value: function teardown() {
            if (this.hostedFields) {
                this.hostedFields.teardown();
            }
        }
    }]);

    return BraintreeApi;
}(Api);

export default BraintreeApi;