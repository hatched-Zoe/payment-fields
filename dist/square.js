import _Promise from 'babel-runtime/core-js/promise';
import _Object$assign from 'babel-runtime/core-js/object/assign';
import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _get from 'babel-runtime/helpers/get';
import _inherits from 'babel-runtime/helpers/inherits';
import Api from './api';
import { camelCaseKeys } from './util';

export var EVENTS_MAP = {
    focusClassAdded: 'onFocus',
    focusClassRemoved: 'onBlur',
    errorClassAdded: 'onValidityChange',
    errorClassRemoved: 'onValidityChange',
    cardBrandChanged: 'onCardTypeChange',
    postalCodeChanged: 'onChange'
};

var EVENT_DECODERS = {
    onCardTypeChange: function onCardTypeChange(event) {
        return { brand: event.cardBrand };
    }
};

// sandbox-sq0idp-i06hC8ZeXrqOujH_QfYt5Q

export var SquareField = function (_Api$Field) {
    _inherits(SquareField, _Api$Field);

    function SquareField(api, props) {
        _classCallCheck(this, SquareField);

        var _this = _possibleConstructorReturn(this, (SquareField.__proto__ || _Object$getPrototypeOf(SquareField)).call(this, api, props));

        _this.options.elementId = _this.id;
        return _this;
    }

    _createClass(SquareField, [{
        key: 'emit',
        value: function emit(ev) {
            _Object$assign(ev, {
                isValid: ev.event.currentState.isCompletelyValid,
                isPotentiallyValid: ev.event.currentState.isPotentiallyValid
            });
            _get(SquareField.prototype.__proto__ || _Object$getPrototypeOf(SquareField.prototype), 'emit', this).call(this, ev);
            if (this.isValid !== ev.event.currentState.isCompletelyValid) {
                this.isValid = ev.event.currentState.isCompletelyValid;
                _get(SquareField.prototype.__proto__ || _Object$getPrototypeOf(SquareField.prototype), 'emit', this).call(this, _Object$assign({}, ev, {
                    type: 'onValidityChange'
                }));
            }
        }
    }]);

    return SquareField;
}(Api.Field);

var SquareApi = function (_Api) {
    _inherits(SquareApi, _Api);

    function SquareApi(props) {
        _classCallCheck(this, SquareApi);

        var _this2 = _possibleConstructorReturn(this, (SquareApi.__proto__ || _Object$getPrototypeOf(SquareApi)).call(this, {
            isReady: !!global.SqPaymentForm,
            urls: ['https://js.squareup.com/v2/paymentform'],
            props: props
        }));

        _this2.FieldClass = SquareField;
        return _this2;
    }

    _createClass(SquareApi, [{
        key: 'isApiReady',
        value: function isApiReady() {
            return !!global.SqPaymentForm;
        }
    }, {
        key: 'createInstance',
        value: function createInstance() {
            var options = {
                inputClass: 'hosted-card-field',
                applicationId: this.authorization,
                captureUncaughtExceptions: true,
                inputStyles: [camelCaseKeys(this.styles.base)]
            };
            for (var type in this.fields) {
                // eslint-disable-line
                var field = this.fields[type];
                options[field.type] = field.options;
            }
            options.callbacks = {
                cardNonceResponseReceived: this.onCardNonce.bind(this),
                inputEventReceived: this.onFieldEvent.bind(this),
                paymentFormLoaded: this.onFieldsReady.bind(this)
            };
            this.hostedFields = new global.SqPaymentForm(options);
            this.hostedFields.build();
        }
    }, {
        key: 'onFieldEvent',
        value: function onFieldEvent(event) {
            var type = EVENTS_MAP[event.eventType] || event.eventType;
            var attrs = EVENT_DECODERS[type] ? EVENT_DECODERS[type](event) : {};

            var sanitizedEvent = _Object$assign({
                field: event.field,
                type: type,
                event: event
            }, attrs);

            this.fields[event.field].emit(sanitizedEvent);

            _get(SquareApi.prototype.__proto__ || _Object$getPrototypeOf(SquareApi.prototype), 'onFieldEvent', this).call(this, sanitizedEvent);

            if (event.currentState.isCompletelyValid !== event.previousState.isCompletelyValid) {
                this.onFieldValidity(_Object$assign(sanitizedEvent, {
                    type: 'validityChange',
                    isValid: event.currentState.isCompletelyValid,
                    isPotentiallyValid: event.currentState.isPotentiallyValid
                }));
            }
        }
    }, {
        key: 'onCardNonce',
        value: function onCardNonce(errors, nonce, cardData) {
            var pendingToken = this.pendingToken;

            this.pendingToken = null;
            if (errors) {
                pendingToken.reject({ errors: errors });
                return;
            }
            pendingToken.resolve({ token: nonce, cardData: cardData });
        }
    }, {
        key: 'tokenize',
        value: function tokenize() {
            var _this3 = this;

            if (this.pendingToken) {
                return _Promise.reject(new Error('tokenization in progress'));
            }
            return new _Promise(function (resolve, reject) {
                _this3.pendingToken = { resolve: resolve, reject: reject };
                _this3.hostedFields.requestCardNonce();
            });
        }
    }, {
        key: 'teardown',
        value: function teardown() {
            if (this.hostedFields) {
                this.hostedFields.destroy();
            }
            _get(SquareApi.prototype.__proto__ || _Object$getPrototypeOf(SquareApi.prototype), 'teardown', this).call(this);
        }
    }]);

    return SquareApi;
}(Api);

export default SquareApi;