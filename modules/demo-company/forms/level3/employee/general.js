import { html } from "polylib";
import { PlForm } from "@nfjs/front-pl/components/pl-form.js";

export default class EmployeeAdd extends PlForm {
    static get properties() {
        return {
            employee: {
                type: Object,
                value: () => undefined
            },
            now: {
                value: () => new Date()
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
                <h3>Персональные данные</h3>
                <pl-input orientation="horizontal" label="Фамилия" required value="{{employee.lastname}}"></pl-input>
                <pl-input orientation="horizontal" label="Имя" required value="{{employee.firstname}}"></pl-input>
                <pl-input orientation="horizontal" label="Отчество" value="{{employee.patronymic}}"></pl-input>
                <pl-radio-group orientation="horizontal" required label="Пол" selected="{{employee.gender}}">
                    <pl-radio-button label="Мужской" name="1"></pl-radio-button>
                    <pl-radio-button label="Женский" name="2"></pl-radio-button>
                </pl-radio-group>
                <pl-datetime orientation="horizontal" max="[[now]]" label="Дата рождения" required value="{{employee.birthdate}}"></pl-datetime>
            </pl-flex-layout>
		`;
    }
}