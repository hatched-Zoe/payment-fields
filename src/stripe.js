import Api from './api';
import { camelCaseKeys } from './util.js';

// pk_Kljj8QJjBXmRjXgP1OyfXSlfku3CX

const EVENTS_MAP = {
    onChange: 'change',
    onBlur:   'blur',
    onFocus:  'focus',

};

export const TYPES_MAP = {
    expirationDate: 'cardExpiry',
    cvv: 'cardCvc',
};

const EVENT_DECODERS = {
    onValidityChange(event) {
        return { isValid: event.isValid };
    },

    onCardTypeChange(event) {
        return Object.assign(
            event.cards[0],
            { type: 'onCardTypeChange', brand: event.cards[0].type },
        );
    },

};


class StripeField extends Api.Field {

    constructor(api, props) {
        super(api, props);
        this.type = TYPES_MAP[this.type] || this.type;
        if (!this.options.style) {
            this.options.style = this.api.fieldStyles;
        }
        this.isValid = false;
    }

    mount(elements) {
        this.element = elements.create(this.type, this.options);
        this.element.mount(this.selector);
        this.element.addEventListener('change', (ev) => {
            if (ev.isValid !== this.isValid) {
                this.isValid = !ev.error;
                if (this.events.onValidityChange) {
                    this.api.onFieldEvent('onValidityChange', this, ev);
                }
                this.api.onFieldValidity(this);
            }
        });

        if ('cardNumber' === this.type) {
            this.element.addEventListener('ready', () => {
                this.api.onFieldsReady();
            });
            this.element.addEventListener('change', ev => this.api.onCardChange(ev));
        }

        for (const evName in this.events) { // eslint-disable-line
            this.element.addEventListener(
                EVENTS_MAP[evName] || evName,
                ev => this.api.onFieldEvent(evName, this, ev),
            );
        }
    }

    unmount() {
        if (this.element) { this.element.unmount(); }
    }

}


export default class StripeApi extends Api {

    FieldClass = StripeField;

    cardType = '';

    constructor(props) {
        super({
            isReady: !!global.Stripe,
            urls: ['https://js.stripe.com/v3/'],
            props,
        });
    }

    get fieldStyles() {
        return {
            base: Object.assign(
                camelCaseKeys(this.styles.base),
                { ':focus': camelCaseKeys(this.styles.focus) },
            ),
            complete: camelCaseKeys(this.styles.valid),
            invalid: camelCaseKeys(this.styles.invalid),
        };
    }

    isApiReady() {
        return !!global.Stripe;
    }

    onFieldValidity() {
        for (const type in this.fields) { // eslint-disable-line
            if (!this.fields[type].isValid) {
                super.onFieldValidity({ isValid: false });
                return;
            }
        }
        super.onFieldValidity({ isValid: true });
    }

    onCardChange(ev) {
        if (this.wrapperHandlers.onCardTypeChange && ev.brand !== this.cardType) {
            this.wrapperHandlers.onCardTypeChange(ev);
        }
    }

    createInstance() {
        this.stripe = global.Stripe(this.authorization);
        this.elements = this.stripe.elements();
        for (const type in this.fields) { // eslint-disable-line
            this.fields[type].mount(this.elements);
        }
    }

    onFieldEvent(eventName, field, event) {
        const attrs = EVENT_DECODERS[eventName] ? EVENT_DECODERS[eventName](event) : {};
        // ev.isValid = this.isValid;
        // ev.isPotentiallyValid = !ev.error;
        const sanitizedEvent = Object.assign({
            field: field.props.type,
            type: eventName,
            isValid: !!event.isValid,
            isPotentiallyValid: !event.error,
            event,
        }, attrs);
        field.emit(sanitizedEvent);

        if ('onValidityChange' === eventName) {
            this.onFieldValidity();
        } else {
            super.onFieldEvent(sanitizedEvent);
        }
    }

    tokenize(cardData) {
        return new Promise((resolve, reject) => {
            this.stripe.createToken(this.fields.cardNumber.element, cardData).then((result) => {
                if (result.error) {
                    reject(result.error);
                } else {
                    resolve(result);
                }
            });
        });
    }

    teardown() {
        if (this.stripe) {
            for (const type in this.fields) { // eslint-disable-line
                this.fields[type].unmount();
            }
        }
    }

}
