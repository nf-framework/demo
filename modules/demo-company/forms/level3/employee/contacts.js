import { html, css } from "polylib";
import { PlForm } from "@nfjs/front-pl/components/pl-form.js";

export default class EmployeeAdd extends PlForm {
    static get properties() {
        return {
            contacts: {
                type: Array,
                observer: '_contactsObserver'
            },
            contact_types: {
                type: Array,
                value: () => [
                    {
                        "value": 1,
                        "text": "Телефон"
                    },
                    {
                        "value": 2,
                        "text": "Электронная почта"
                    }
                ]
            },
            invalid: {
                value: false
            }
        }
    }

    static get template() {
        return html`
            <pl-valid-observer invalid="{{invalid}}"></pl-valid-observer>
            <pl-flex-layout vertical>
                <h3>Контакты</h3>
                <pl-button variant="ghost" label="Добавить контакт" on-click="[[onContactAddClick]]">
                    <pl-icon iconset="pl-default" size="16" icon="plus" slot="prefix"></pl-icon>
                </pl-button>
                <template d:repeat="{{contacts}}">
                    <pl-flex-layout align="flex-end" style="width: 480px;">
                        <pl-combobox stretch data="[[contact_types]]" placeholder="Тип" value="{{item.contact_type}}" required></pl-combobox>
                        <pl-input stretch disabled="[[!item.contact_type]]" placeholder="Контакт" value="{{item.contact}}" required pattern="[[_getPattern(item.contact_type)]]">
                            <pl-input-mask mask="[[_getMask(item.contact_type)]]" unmasked-value="{{item.unmaskedValue}}">
                            </pl-input-mask>
                        </pl-input>
                        <pl-icon-button variant="ghost" iconset="pl-default" size="16" icon="trashcan"
                            on-click="[[onContactDelClick]]">
                        </pl-icon-button>
                    </pl-flex-layout>
                </template>
            </pl-flex-layout>`;
    }

    onContactAddClick() {
        this.push('contacts', {});
    }

    onContactDelClick(event) {
        this.splice('contacts', this.contacts.indexOf(event.model.item), 1);
    }

    _contactsObserver(val, old, mut) {
        const m = mut.path.match(/^contacts\.(\d*)\.contact_type/);
        if (m) {
            this.set(`contacts.${m[1]}.contact`, null);
        }
    }

    _getPattern(type) {
        if (type && type == 2) {
            return '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$'
        } else {
            return null;
        }
    }

    _getMask(type) {
        if (type && type == 1) {
            return '+0 (000) 000 00 00'
        } else {
            return '';
        }
    }
}