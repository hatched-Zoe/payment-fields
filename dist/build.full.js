(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('loadjs'), require('react'), require('prop-types')) :
	typeof define === 'function' && define.amd ? define(['loadjs', 'react', 'prop-types'], factory) :
	(global['payment-fields'] = factory(global.loadjs,global.React,global.PropTypes));
}(this, (function (loadjs,React,PropTypes) { 'use strict';

loadjs = loadjs && loadjs.hasOwnProperty('default') ? loadjs['default'] : loadjs;
React = React && React.hasOwnProperty('default') ? React['default'] : React;
PropTypes = PropTypes && PropTypes.hasOwnProperty('default') ? PropTypes['default'] : PropTypes;

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};









var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var _class;
var _temp;

var NEXT_FIELD_ID = 0;



function nextFieldId() {
    NEXT_FIELD_ID += 1;
    return NEXT_FIELD_ID;
}

var Field = function () {
    function Field(api, props) {
        classCallCheck(this, Field);

        this.api = api;
        this.isReady = false;
        this.events = Object.create(null);
        this.props = props;
        var type = props.type,
            rest = objectWithoutProperties(props, ['type']);

        this.id = 'field-wrapper-' + nextFieldId();
        this.type = type;
        for (var key in rest) {
            // eslint-disable-line
            if ('on' === key.substr(0, 2)) {
                this.events[key] = rest[key];
                delete rest[key];
            }
        }
        this.options = rest;
    }

    createClass(Field, [{
        key: 'emit',
        value: function emit(event) {
            if (this.events[event.type]) {
                this.events[event.type](event);
            }
        }
    }, {
        key: 'selector',
        get: function get$$1() {
            return '#' + this.id;
        }
    }]);
    return Field;
}();

var ClientApi = (_temp = _class = function () {
    function ClientApi(_ref) {
        var isReady = _ref.isReady,
            urls = _ref.urls,
            props = _ref.props;
        classCallCheck(this, ClientApi);
        this.fields = Object.create(null);
        this.fieldHandlers = Object.create(null);
        var _ = props.authorization,
            styles = props.styles,
            callbacks = objectWithoutProperties(props, ['authorization', 'styles']);

        this.styles = styles || {};
        this.wrapperHandlers = callbacks || {};
        this.tokenize = this.tokenize.bind(this);
        if (!isReady) {
            this.fetch(urls);
        }
    }

    createClass(ClientApi, [{
        key: 'isApiReady',
        value: function isApiReady() {
            return false;
        }
    }, {
        key: 'fetch',
        value: function fetch(urls) {
            var _this = this;

            loadjs(urls, {
                success: function success() {
                    if (_this.pendingAuthorization) {
                        _this.setAuthorization(_this.pendingAuthorization);
                    }
                },
                error: this.onError.bind(this)
            });
        }
    }, {
        key: 'setAuthorization',
        value: function setAuthorization(authorization) {
            if (!this.isApiReady()) {
                this.pendingAuthorization = authorization;
                return;
            }
            if (!authorization && this.authorization) {
                this.teardown();
            } else if (authorization && authorization !== this.authorization) {
                if (this.authorization) {
                    this.teardown();
                }
                this.authorization = authorization;
                this.createInstance(authorization);
            }
        }
    }, {
        key: 'onError',
        value: function onError(err) {
            if (!err) {
                return;
            }
            if (this.wrapperHandlers.onError) {
                this.wrapperHandlers.onError(err);
            }
        }
    }, {
        key: 'checkInField',
        value: function checkInField(props) {
            var FieldClass = this.FieldClass;

            var field = new FieldClass(this, props);
            this.fields[field.type] = field;
            return field.id;
        }
    }, {
        key: 'onFieldsReady',
        value: function onFieldsReady() {
            if (this.wrapperHandlers.onReady) {
                this.wrapperHandlers.onReady({ tokenize: this.tokenize });
            }
        }
    }, {
        key: 'onFieldValidity',
        value: function onFieldValidity(event) {
            if (this.wrapperHandlers.onValidityChange) {
                this.wrapperHandlers.onValidityChange(event);
            }
        }
    }, {
        key: 'onFieldEvent',
        value: function onFieldEvent(event) {
            if (this.wrapperHandlers[event.type]) {
                this.wrapperHandlers[event.type](event);
            }
        }

        // the following fields are implemented in each client lib

    }, {
        key: 'createInstance',
        value: function createInstance() {}
    }, {
        key: 'tokenize',
        value: function tokenize() {}
    }, {
        key: 'teardown',
        value: function teardown() {}
    }]);
    return ClientApi;
}(), _class.Field = Field, _temp);

// sandbox_g42y39zw_348pk9cgf3bgyw2b

var EVENTS_MAP = {
    focus: 'onFocus',
    blur: 'onBlur',
    validityChange: 'onValidityChange',
    cardTypeChange: 'onCardTypeChange'
};

var EVENT_DECODERS = {
    onCardTypeChange: function onCardTypeChange(event) {
        var card = 1 === event.cards.length ? event.cards[0] : {};
        return Object.assign(card, { type: 'onCardTypeChange', brand: card.type });
    }
};

var TYPES_MAP = {
    cardNumber: 'number'
};

var BraintreeField = function (_Api$Field) {
    inherits(BraintreeField, _Api$Field);

    function BraintreeField(api, props) {
        classCallCheck(this, BraintreeField);

        var _this = possibleConstructorReturn(this, (BraintreeField.__proto__ || Object.getPrototypeOf(BraintreeField)).call(this, api, props));

        _this.type = TYPES_MAP[_this.type] || _this.type;
        _this.options.selector = '#' + _this.id;
        return _this;
    }

    return BraintreeField;
}(ClientApi.Field);

var BraintreeApi = function (_Api) {
    inherits(BraintreeApi, _Api);

    function BraintreeApi(props) {
        classCallCheck(this, BraintreeApi);

        var _this2 = possibleConstructorReturn(this, (BraintreeApi.__proto__ || Object.getPrototypeOf(BraintreeApi)).call(this, {
            props: props,
            isReady: !!global.braintree,
            urls: ['https://js.braintreegateway.com/web/3.43.0/js/client.min.js', 'https://js.braintreegateway.com/web/3.43.0/js/hosted-fields.min.js']
        }));

        _this2.FieldClass = BraintreeField;
        return _this2;
    }

    createClass(BraintreeApi, [{
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
            Object.keys(this.fields).forEach(function (fieldName) {
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
            var sanitizedEvent = Object.assign({
                field: field.props.type,
                type: type,
                event: event,
                isPotentiallyValid: event.fields[event.emittedBy].isPotentiallyValid,
                isValid: event.fields[event.emittedBy].isValid
            }, attrs);
            field.emit(sanitizedEvent);

            if ('validityChange' === eventName) {
                var isValid = true;
                var fields = Object.keys(event.fields);
                for (var fi = 0; fi < fields.length; fi++) {
                    isValid = Boolean(event.fields[fields[fi]].isValid);
                    if (!isValid) {
                        break;
                    }
                }
                this.onFieldValidity(Object.assign(sanitizedEvent, { isValid: isValid }));
            } else {
                get(BraintreeApi.prototype.__proto__ || Object.getPrototypeOf(BraintreeApi.prototype), 'onFieldEvent', this).call(this, sanitizedEvent);
            }
        }
    }, {
        key: 'tokenize',
        value: function tokenize() {
            var _this5 = this;

            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            return new Promise(function (resolve, reject) {
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
}(ClientApi);

function camelCase(str) {
    return str.replace(/-([a-z])/gi, function (s, c, i) {
        return 0 === i ? c : c.toUpperCase();
    });
}

function camelCaseKeys(src) {
    if (!src) return {};
    var dest = {};
    var keys = Object.keys(src);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        dest[camelCase(key)] = src[key];
    }
    return dest;
}

var EVENTS_MAP$1 = {
    focusClassAdded: 'onFocus',
    focusClassRemoved: 'onBlur',
    errorClassAdded: 'onValidityChange',
    errorClassRemoved: 'onValidityChange',
    cardBrandChanged: 'onCardTypeChange',
    postalCodeChanged: 'onChange'
};

var EVENT_DECODERS$1 = {
    onCardTypeChange: function onCardTypeChange(event) {
        return { brand: event.cardBrand };
    }
};

// sandbox-sq0idp-i06hC8ZeXrqOujH_QfYt5Q

var SquareField = function (_Api$Field) {
    inherits(SquareField, _Api$Field);

    function SquareField(api, props) {
        classCallCheck(this, SquareField);

        var _this = possibleConstructorReturn(this, (SquareField.__proto__ || Object.getPrototypeOf(SquareField)).call(this, api, props));

        _this.options.elementId = _this.id;
        return _this;
    }

    createClass(SquareField, [{
        key: 'emit',
        value: function emit(ev) {
            Object.assign(ev, {
                isValid: ev.event.currentState.isCompletelyValid,
                isPotentiallyValid: ev.event.currentState.isPotentiallyValid
            });
            get(SquareField.prototype.__proto__ || Object.getPrototypeOf(SquareField.prototype), 'emit', this).call(this, ev);
            if (this.isValid !== ev.event.currentState.isCompletelyValid) {
                this.isValid = ev.event.currentState.isCompletelyValid;
                get(SquareField.prototype.__proto__ || Object.getPrototypeOf(SquareField.prototype), 'emit', this).call(this, Object.assign({}, ev, {
                    type: 'onValidityChange'
                }));
            }
        }
    }]);
    return SquareField;
}(ClientApi.Field);

var SquareApi = function (_Api) {
    inherits(SquareApi, _Api);

    function SquareApi(props) {
        classCallCheck(this, SquareApi);

        var _this2 = possibleConstructorReturn(this, (SquareApi.__proto__ || Object.getPrototypeOf(SquareApi)).call(this, {
            isReady: !!global.SqPaymentForm,
            urls: ['https://js.squareup.com/v2/paymentform'],
            props: props
        }));

        _this2.FieldClass = SquareField;
        return _this2;
    }

    createClass(SquareApi, [{
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
            var type = EVENTS_MAP$1[event.eventType] || event.eventType;
            var attrs = EVENT_DECODERS$1[type] ? EVENT_DECODERS$1[type](event) : {};

            var sanitizedEvent = Object.assign({
                field: event.field,
                type: type,
                event: event
            }, attrs);

            this.fields[event.field].emit(sanitizedEvent);

            get(SquareApi.prototype.__proto__ || Object.getPrototypeOf(SquareApi.prototype), 'onFieldEvent', this).call(this, sanitizedEvent);

            if (event.currentState.isCompletelyValid !== event.previousState.isCompletelyValid) {
                this.onFieldValidity(Object.assign(sanitizedEvent, {
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
                return Promise.reject(new Error('tokenization in progress'));
            }
            return new Promise(function (resolve, reject) {
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
            get(SquareApi.prototype.__proto__ || Object.getPrototypeOf(SquareApi.prototype), 'teardown', this).call(this);
        }
    }]);
    return SquareApi;
}(ClientApi);

// pk_Kljj8QJjBXmRjXgP1OyfXSlfku3CX

var EVENTS_MAP$2 = {
    onChange: 'change',
    onBlur: 'blur',
    onFocus: 'focus'

};

var TYPES_MAP$1 = {
    expirationDate: 'cardExpiry',
    cvv: 'cardCvc'
};

var EVENT_DECODERS$2 = {
    onValidityChange: function onValidityChange(event) {
        return { isValid: event.isValid };
    },
    onCardTypeChange: function onCardTypeChange(event) {
        return Object.assign(event.cards[0], { type: 'onCardTypeChange', brand: event.cards[0].type });
    }
};

var StripeField = function (_Api$Field) {
    inherits(StripeField, _Api$Field);

    function StripeField(api, props) {
        classCallCheck(this, StripeField);

        var _this = possibleConstructorReturn(this, (StripeField.__proto__ || Object.getPrototypeOf(StripeField)).call(this, api, props));

        _this.type = TYPES_MAP$1[_this.type] || _this.type;
        if (!_this.options.style) {
            _this.options.style = _this.api.fieldStyles;
        }
        _this.isValid = false;
        return _this;
    }

    createClass(StripeField, [{
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
                _this2.element.addEventListener(EVENTS_MAP$2[evName] || evName, function (ev) {
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
}(ClientApi.Field);

var StripeApi = function (_Api) {
    inherits(StripeApi, _Api);

    function StripeApi(props) {
        classCallCheck(this, StripeApi);

        var _this3 = possibleConstructorReturn(this, (StripeApi.__proto__ || Object.getPrototypeOf(StripeApi)).call(this, {
            isReady: !!global.Stripe,
            urls: ['https://js.stripe.com/v3/'],
            props: props
        }));

        _this3.FieldClass = StripeField;
        _this3.cardType = '';
        return _this3;
    }

    createClass(StripeApi, [{
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
                    get(StripeApi.prototype.__proto__ || Object.getPrototypeOf(StripeApi.prototype), 'onFieldValidity', this).call(this, { isValid: false });
                    return;
                }
            }
            get(StripeApi.prototype.__proto__ || Object.getPrototypeOf(StripeApi.prototype), 'onFieldValidity', this).call(this, { isValid: true });
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
            var attrs = EVENT_DECODERS$2[eventName] ? EVENT_DECODERS$2[eventName](event) : {};
            // ev.isValid = this.isValid;
            // ev.isPotentiallyValid = !ev.error;
            var sanitizedEvent = Object.assign({
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
                get(StripeApi.prototype.__proto__ || Object.getPrototypeOf(StripeApi.prototype), 'onFieldEvent', this).call(this, sanitizedEvent);
            }
        }
    }, {
        key: 'tokenize',
        value: function tokenize(cardData) {
            var _this4 = this;

            return new Promise(function (resolve, reject) {
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
        get: function get$$1() {
            return {
                base: Object.assign(camelCaseKeys(this.styles.base), { ':focus': camelCaseKeys(this.styles.focus) }),
                complete: camelCaseKeys(this.styles.valid),
                invalid: camelCaseKeys(this.styles.invalid)
            };
        }
    }]);
    return StripeApi;
}(ClientApi);

var Vendors = {
    Braintree: BraintreeApi, Square: SquareApi, Stripe: StripeApi
};

var _class$1;
var _temp$1;

var Field$1 = (_temp$1 = _class$1 = function (_React$Component) {
    inherits(Field, _React$Component);

    function Field() {
        classCallCheck(this, Field);
        return possibleConstructorReturn(this, (Field.__proto__ || Object.getPrototypeOf(Field)).apply(this, arguments));
    }

    createClass(Field, [{
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
        get: function get$$1() {
            var list = ['payment-field'];
            if (this.props.className) {
                list.push(this.props.className);
            }
            return list.join(' ');
        }
    }]);
    return Field;
}(React.Component), _class$1.propTypes = {
    type: PropTypes.oneOf(['cardNumber', 'expirationDate', 'cvv', 'postalCode']).isRequired,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    onValidityChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func
}, _class$1.defaultProps = {
    placeholder: ''
}, _class$1.contextTypes = {
    paymentFieldsApi: PropTypes.object
}, _temp$1);

var _class$2;
var _temp$2;

var PaymentFields = (_temp$2 = _class$2 = function (_React$Component) {
    inherits(PaymentFields, _React$Component);

    function PaymentFields(props) {
        classCallCheck(this, PaymentFields);

        var _this = possibleConstructorReturn(this, (PaymentFields.__proto__ || Object.getPrototypeOf(PaymentFields)).call(this, props));

        var Api = Vendors[props.vendor];
        _this.api = new Api(props);
        return _this;
    }

    createClass(PaymentFields, [{
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
}(React.Component), _class$2.Field = Field$1, _class$2.propTypes = {
    vendor: PropTypes.oneOf(Object.keys(Vendors)).isRequired,
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
}, _class$2.defaultProps = {
    tagName: 'div',
    styles: {}
}, _class$2.childContextTypes = {
    paymentFieldsApi: PropTypes.object
}, _temp$2);

return PaymentFields;

})));
