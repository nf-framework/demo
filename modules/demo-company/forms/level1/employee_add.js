import { html, css } from "polylib";
import { PlForm } from "@nfjs/front-pl/components/pl-form.js";

export default class EmployeeAdd extends PlForm {
    static get properties() {
        return {
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
            },
            formTitle: {
                type: String,
                value: 'Сотрудник'
            }
        }
    }


    static get template() {
        return html`
            <pl-valid-observer invalid="{{invalid}}"></pl-valid-observer>
            <pl-flex-layout scrollable vertical fit>
                <pl-input label="Фамилия" required value="{{employee.lastname}}"></pl-input>
                <pl-input label="Имя" required value="{{employee.firstname}}"></pl-input>
                <pl-input label="Отчество" value="{{employee.patronymic}}"></pl-input>
                <pl-radio-group required label="Пол" selected="{{employee.gender}}">
                    <pl-radio-button label="Мужской" name="1"></pl-radio-button>
                    <pl-radio-button label="Женский" name="2"></pl-radio-button>
                </pl-radio-group>
                <pl-datetime max="[[now]]" label="Дата рождения" required value="{{employee.birthdate}}"></pl-datetime>
                <pl-flex-layout>
                    <pl-button label="Сохранить" variant="primary" disabled="[[invalid]]" on-click="[[onSaveClick]]">
                        <pl-icon iconset="pl-default" size="16" icon="save" slot="prefix"></pl-icon>
                    </pl-button>
                    <pl-button label="Отменить" variant="secondary" on-click="[[close]]">
                        <pl-icon iconset="pl-default" size="16" icon="close" slot="prefix"></pl-icon>
                    </pl-button>
                </pl-flex-layout>
            </pl-flex-layout>
            <pl-action args="[[_compose('employeeId',employeeId)]]" id="aGet" data="{{employee}}" endpoint="/employee/get" execute-on-args-change required-args='employeeId'></pl-action>
            <pl-action args="[[_compose('...', employee)]]" id="aCreate" endpoint="/employee/create"></pl-action>
            <pl-action args="[[_compose('...', employee)]]" id="aUpdate" endpoint="/employee/update"></pl-action>
		`;
    }

    async onSaveClick() {
        if (this.employee.id) {
            await this.$.aUpdate.execute();
        } else {
            const data = await this.$.aCreate.execute();
            this.employeeId = data.id;
        }

        this.notify('Сохранение прошло успешно');
    }
}