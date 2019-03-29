import _Promise from 'babel-runtime/core-js/promise';
import _get from 'babel-runtime/helpers/get';
import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import _Object$assign from 'babel-runtime/core-js/object/assign';
import Api from './api';
import { camelCaseKeys } from './util.js';

// pk_Kljj8QJjBXmRjXgP1OyfXSlfku3CX

var EVENTS_MAP = {
    onChange: 'change',
    onBlur: 'blur',
    onFocus: 'focus'

};

export var TYPES_MAP = {
    expirationDate: 'cardExpiry',
    cvv: 'cardCvc'
};

var EVENT_DECODERS = {
    onValidityChange: function onValidityChange(event) {
        return { isValid: event.isValid };
    },
    onCardTypeChange: function onCardTypeChange(event) {
        return _Object$assign(event.cards[0], { type: 'onCardTypeChange', brand: event.cards[0].type });
    }
};

var StripeField = function (_Api$Field) {
    _inherits(StripeField, _Api$Field);

    function StripeField(api, props) {
        _classCallCheck(this, StripeField);

        var _this = _possibleConstructorReturn(this, (StripeField.__proto__ || _Object$getPrototypeOf(StripeField)).call(this, api, props));

        _this.type = TYPES_MAP[_this.type] || _this.type;
        if (!_this.options.style) {
            _this.options.style = _this.api.fieldStyles;
        }
        _this.isValid = false;
        return _this;
    }

    _createClass(StripeField, [{
        key: 'mount',
        value: function mount(elements) {
            var _this2 = this;

            this.element = elements.create(this.type, this.options);
            this.element.mount(this.selector);
            this.element.addEventListener('change', function (ev) {
                if (ev.isValid !== _this2.isValid) {
                    _this2.isValid = !ev.error;
                    if (_this2.events.onValidityChange) {
                        _this2.api.onFieldEvent('onValidityChange', _this2, ev);
                    }
                    _this2.api.onFieldValidity(_this2);
                }
            });

            if ('cardNumber' === this.type) {
                this.element.addEventListener('ready', function () {
                    _this2.api.onFieldsReady();
                });
                this.element.addEventListener('change', function (ev) {
                    return _this2.api.onCardChange(ev);
                });
            }

            var _loop = function _loop(evName) {
                // eslint-disable-line
                _this2.element.addEventListener(EVENTS_MAP[evName] || evName, function (ev) {
                    return _this2.api.onFieldEvent(evName, _this2, ev);
                });
            };

            for (var evName in this.events) {
                _loop(evName);
            }
        }
    }, {
        key: 'unmount',
        value: function unmount() {
            if (this.element) {
                this.element.unmount();
            }
        }
    }]);

    return StripeField;
}(Api.Field);

var StripeApi = function (_Api) {
    _inherits(StripeApi, _Api);

    function StripeApi(props) {
        _classCallCheck(this, StripeApi);

        var _this3 = _possibleConstructorReturn(this, (StripeApi.__proto__ || _Object$getPrototypeOf(StripeApi)).call(this, {
            isReady: !!global.Stripe,
            urls: ['https://js.stripe.com/v3/'],
            props: props
        }));

        _this3.FieldClass = StripeField;
        _this3.cardType = '';
        return _this3;
    }

    _createClass(StripeApi, [{
        key: 'isApiReady',
        value: function isApiReady() {
            return !!global.Stripe;
        }
    }, {
        key: 'onFieldValidity',
        value: function onFieldValidity() {
            for (var type in this.fields) {
                // eslint-disable-line
                if (!this.fields[type].isValid) {
                    _get(StripeApi.prototype.__proto__ || _Object$getPrototypeOf(StripeApi.prototype), 'onFieldValidity', this).call(this, { isValid: false });
                    return;
                }
            }
            _get(StripeApi.prototype.__proto__ || _Object$getPrototypeOf(StripeApi.prototype), 'onFieldValidity', this).call(this, { isValid: true });
        }
    }, {
        key: 'onCardChange',
        value: function onCardChange(ev) {
            if (this.wrapperHandlers.onCardTypeChange && ev.brand !== this.cardType) {
                this.wrapperHandlers.onCardTypeChange(ev);
            }
        }
    }, {
        key: 'createInstance',
        value: function createInstance() {
            this.stripe = global.Stripe(this.authorization);
            this.elements = this.stripe.elements();
            for (var type in this.fields) {
                // eslint-disable-line
                this.fields[type].mount(this.elements);
            }
        }
    }, {
        key: 'onFieldEvent',
        value: function onFieldEvent(eventName, field, event) {
            var attrs = EVENT_DECODERS[eventName] ? EVENT_DECODERS[eventName](event) : {};
            // ev.isValid = this.isValid;
            // ev.isPotentiallyValid = !ev.error;
            var sanitizedEvent = _Object$assign({
                field: field.props.type,
                type: eventName,
                isValid: !!event.isValid,
                isPotentiallyValid: !event.error,
                event: event
            }, attrs);
            field.emit(sanitizedEvent);

            if ('onValidityChange' === eventName) {
                this.onFieldValidity();
            } else {
                _get(StripeApi.prototype.__proto__ || _Object$getPrototypeOf(StripeApi.prototype), 'onFieldEvent', this).call(this, sanitizedEvent);
            }
        }
    }, {
        key: 'tokenize',
        value: function tokenize(cardData) {
            var _this4 = this;

            return new _Promise(function (resolve, reject) {
                _this4.stripe.createToken(_this4.fields.cardNumber.element, cardData).then(function (result) {
                    if (result.error) {
                        reject(result.error);
                    } else {
                        resolve(result);
                    }
                });
            });
        }
    }, {
        key: 'teardown',
        value: function teardown() {
            if (this.stripe) {
                for (var type in this.fields) {
                    // eslint-disable-line
                    this.fields[type].unmount();
                }
            }
        }
    }, {
        key: 'fieldStyles',
        get: function get() {
            return {
                base: _Object$assign(camelCaseKeys(this.styles.base), { ':focus': camelCaseKeys(this.styles.focus) }),
                complete: camelCaseKeys(this.styles.valid),
                invalid: camelCaseKeys(this.styles.invalid)
            };
        }
    }]);

    return StripeApi;
}(Api);

export default StripeApi;