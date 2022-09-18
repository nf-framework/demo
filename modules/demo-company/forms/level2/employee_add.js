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
                value: () => [],
                observer:'_contactsObserver'
            },
            isContactsChanged: {
                type: Boolean
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
            now: {
                value: () => new Date()
            },
            invalid: {
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
            <pl-flex-layout scrollable vertical fit>
                <b>Персональные данные</b>
                <pl-flex-layout vertical>
                    <pl-input label="Фамилия" required value="{{employee.lastname}}"></pl-input>
                    <pl-input label="Имя" required value="{{employee.firstname}}"></pl-input>
                    <pl-input label="Отчество" value="{{employee.patronymic}}"></pl-input>
                    <pl-radio-group required label="Пол" selected="{{employee.gender}}">
                        <pl-radio-button label="Мужской" name="1"></pl-radio-button>
                        <pl-radio-button label="Женский" name="2"></pl-radio-button>
                    </pl-radio-group>
                    <pl-datetime max="[[now]]" label="Дата рождения" required value="{{employee.birthdate}}"></pl-datetime>
                </pl-flex-layout>
                <pl-flex-layout vertical>
                    <b>Контакты</b>
                    <pl-button variant="ghost" label="Добавить контакт" on-click="[[onContactAddClick]]">
                        <pl-icon iconset="pl-default" size="16" icon="plus" slot="prefix"></pl-icon>
                    </pl-button>
                    <template d:repeat="{{contacts}}">
                        <pl-flex-layout align="flex-end">
                            <pl-combobox data="[[contact_types]]" label="Тип" value="{{item.contact_type}}" required></pl-combobox>
                            <pl-input label="Контакт" value="{{item.contact}}" required pattern="[[_getPattern(item.contact_type)]]">
                                <pl-input-mask  mask="[[_getMask(item.contact_type)]]" unmasked-value="{{item.unmaskedValue}}"></pl-input-mask>
                            </pl-input>
                            <pl-icon-button variant="ghost" iconset="pl-default" size="16" icon="trashcan"
                                on-click="[[onContactDelClick]]">
                            </pl-icon-button>
                        </pl-flex-layout>
                    </template>
                </pl-flex-layout>
                <pl-flex-layout>
                    <pl-button label="Сохранить" variant="primary" disabled="[[invalid]]" on-click="[[onSaveClick]]">
                        <pl-icon iconset="pl-default" size="16" icon="save" slot="prefix"></pl-icon>
                    </pl-button>
                    <pl-button label="Отменить" variant="secondary" on-click="[[close]]">
                        <pl-icon iconset="pl-default" size="16" icon="close" slot="prefix"></pl-icon>
                    </pl-button>
                </pl-flex-layout>
            </pl-flex-layout>
            <pl-action args="[[_compose('employeeId',employeeId)]]" id="aGet" data="{{employee}}" endpoint="/employee/get"></pl-action>
            <pl-action id="aSave" endpoint="/employee/save"></pl-action>
            <pl-dataset args="[[_compose('employeeId',employeeId)]]" id="dsContacts" data="{{contacts}}" endpoint="/employee/contactsList"></pl-dataset>

            <pl-data-observer id="obEmployee" data="{{employee}}" is-changed="{{isEmployeeChanged}}"></pl-data-observer>
            <pl-data-observer id="obEmployeeContacts" data="{{contacts}}" is-changed="{{isContactsChanged}}"></pl-data-observer>
		`;
    }

    onConnect(){
        if(this.employeeId) {
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

    _getPattern (type){
        if(type && type == 2) {
            return '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$'
        } else {
            return null;
        }
    }

    _getMask (type){
        if(type && type == 1) {
            return '+0 (000) 000 00 00'
        } else {
            return '';
        }
    }
    
    async onSaveClick() {
        const res = await this.$.aSave.execute({employee: this.employee, contacts: this.contacts._mutations});
        this.employeeId = res.id;
    
        this.reload();
    }

    onClose(){
        if(this.isContactsChanged || this.isEmployeeChanged) {
            return this.showConfirm('Изменения не будут сохранены. Вы уверены что хотите выйти?')
        }
    }
}