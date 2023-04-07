import { html, css } from "polylib";
import { PlForm } from "@nfjs/front-pl/components/pl-form.js";

export default class EmployeeAdd extends PlForm {
    static get properties() {
        return {
            formTitle: {
                type: String,
                value: 'Сотрудник'
            },
            employee: {
                type: Object,
                value: () => ({
                    lastname: undefined,
                    firstname: undefined,
                    patronymic: undefined,
                    gender: undefined,
                    birthdate: undefined
                }),
            },
            isEmployeeChanged: {
                type: Boolean
            },
            contacts: {
                type: Array,
                value: () => []
            },
            isContactsChanged: {
                type: Boolean
            },
            cards: {
                type: Array,
                value: () => []
            },
            isCardsChanged: {
                type: Boolean
            },
            invalid: {
                value: false
            },
            employeeInvalid: {
                value: false
            },
            contactsInvalid: {
                value: false
            },
            cardsInvalid: {
                value: false
            },
            employeeId: {
                type: String,
                value: undefined
            },
            urlParams: {
                type: Array,
                value: ['employeeId']
            }
        }
    }

    static get template() {
        return html`
            <pl-valid-observer invalid="{{invalid}}"></pl-valid-observer>
            <pl-flex-layout vertical fit>
                <pl-flex-layout>
                    <pl-button label="Сохранить" variant="primary" disabled="[[invalid]]" on-click="[[onSaveClick]]">
                        <pl-icon iconset="pl-default" size="16" icon="save" slot="prefix"></pl-icon>
                    </pl-button>
                    <pl-button label="Отменить" variant="secondary" on-click="[[close]]">
                        <pl-icon iconset="pl-default" size="16" icon="close" slot="prefix"></pl-icon>
                    </pl-button>
                </pl-flex-layout>
                <pl-flex-layout fit>
                    <pl-menu-form scrollable selected="main">
                        <pl-menu-form-item name="main" label="Персональные данные">
                            <pl-form-level3.employee.general invalid="{{employeeInvalid}}" employee="{{employee}}"></pl-form-level3.employee.general>
                        </pl-menu-form-item>
                        <pl-menu-form-item name="contacts" label="Контакты">
                            <pl-form-level3.employee.contacts invalid="{{contactsInvalid}}" contacts="{{contacts}}"></pl-form-level3.employee.contacts>
                        </pl-menu-form-item>
                        <pl-menu-form-item name="cards" label="Личная карточка" fit>
                            <pl-form-level3.employee.cards invalid="{{cardsInvalid}}" cards="{{cards}}"></pl-form-level3.employee.cards>
                        </pl-menu-form-item>
                    </pl-menu-form>
                </pl-flex-layout>
            </pl-flex-layout>
            <pl-action args="[[_compose('employeeId',employeeId)]]" id="aGet" data="{{employee}}" endpoint="/employee/get">
            </pl-action>
            <pl-action id="aSave" endpoint="/employee/save"></pl-action>
            <pl-dataset args="[[_compose('employeeId',employeeId)]]" id="dsContacts" data="{{contacts}}"
                endpoint="/employee/contactsList"></pl-dataset>
            <pl-data-observer id="obEmployee" data="{{employee}}" is-changed="{{isEmployeeChanged}}"></pl-data-observer>
            <pl-data-observer id="obEmployeeContacts" data="{{contacts}}" is-changed="{{isContactsChanged}}"></pl-data-observer>
		`;
    }

    onConnect() {
        if (this.employeeId) {
            this.reload();
        } else {
            this.$.obEmployee.reset();
            this.$.obEmployee.snapshot();

            this.$.obEmployeeContacts.reset();
            this.$.obEmployeeContacts.snapshot();
        }
    }

    reload() {
        Promise.all([
            this.$.aGet.execute(),
            this.$.dsContacts.execute()
        ]).then(() => {

            this.$.obEmployee.reset();
            this.$.obEmployee.snapshot();

            this.$.obEmployeeContacts.reset();
            this.$.obEmployeeContacts.snapshot();
        });
    }

    async onSaveClick() {
        const res = await this.$.aSave.execute({ employee: this.employee, contacts: this.contacts._mutations });
        this.employeeId = res.id;

        this.reload();
    }

    onClose() {
        if (this.isContactsChanged || this.isEmployeeChanged) {
            return this.showConfirm('Изменения не будут сохранены. Вы уверены что хотите выйти?')
        }
    }
}