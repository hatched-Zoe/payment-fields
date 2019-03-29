import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _Object$create from 'babel-runtime/core-js/object/create';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import loadjs from 'loadjs';

var NEXT_FIELD_ID = 0;

export function resetIDCounter() {
    NEXT_FIELD_ID = 0;
}

function nextFieldId() {
    NEXT_FIELD_ID += 1;
    return NEXT_FIELD_ID;
}

var Field = function () {
    function Field(api, props) {
        _classCallCheck(this, Field);

        this.api = api;
        this.isReady = false;
        this.events = _Object$create(null);
        this.props = props;

        var type = props.type,
            rest = _objectWithoutProperties(props, ['type']);

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

    _createClass(Field, [{
        key: 'emit',
        value: function emit(event) {
            if (this.events[event.type]) {
                this.events[event.type](event);
            }
        }
    }, {
        key: 'selector',
        get: function get() {
            return '#' + this.id;
        }
    }]);

    return Field;
}();

var ClientApi = function () {
    function ClientApi(_ref) {
        var isReady = _ref.isReady,
            urls = _ref.urls,
            props = _ref.props;

        _classCallCheck(this, ClientApi);

        this.fields = _Object$create(null);
        this.fieldHandlers = _Object$create(null);

        var _ = props.authorization,
            styles = props.styles,
            callbacks = _objectWithoutProperties(props, ['authorization', 'styles']);

        this.styles = styles || {};
        this.wrapperHandlers = callbacks || {};
        this.tokenize = this.tokenize.bind(this);
        if (!isReady) {
            this.fetch(urls);
        }
    }

    _createClass(ClientApi, [{
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
}();

ClientApi.Field = Field;
export default ClientApi;