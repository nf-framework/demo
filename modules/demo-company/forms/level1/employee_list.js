import { html, css } from "polylib";
import { PlForm } from "@nfjs/front-pl/components/pl-form.js";

export default class PolyLib extends PlForm {
    static get properties() {
        return {
            formTitle: {
                type: String,
                value: 'Сотрудники'
            },
            data: { value: () => [] },
            selected: { value: () => null }
        }
    }

    static get template() {
        return html`
            <pl-flex-layout scrollable vertical fit>
                <pl-grid data="{{data}}" selected="{{selected}}" on-row-dblclick="[[onEditClick]]">
                    <pl-flex-layout slot="top-toolbar">
                        <pl-button variant="primary" label="Добавить" on-click="[[onAddClick]]">
                            <pl-icon iconset="pl-default" size="16" icon="plus" slot="prefix"></pl-icon>
                        </pl-button>
                        <pl-button variant="secondary" label="Удалить" disabled="[[!selected]]" on-click="[[onDeleteClick]]">
                            <pl-icon iconset="pl-default" size="16" icon="trashcan" slot="prefix"></pl-icon>
                        </pl-button>
                    </pl-flex-layout>
                    <pl-grid-column sortable field="fio" header="ФИО" resizable></pl-grid-column>
                    <pl-grid-column sortable field="gender_name" header="Пол" width="130" resizable></pl-grid-column>
                    <pl-grid-column sortable field="birthdate" header="Дата рождения" width="150" kind="date" resizable>
                    </pl-grid-column>
                    <pl-grid-column width="48" action>
                        <template>
                            <pl-flex-layout>
                                <pl-icon-button variant="link" iconset="pl-default" size="16" icon="pencil"
                                    on-click="[[onEditClick]]"></pl-icon-button>
                            </pl-flex-layout>
                        </template>
                    </pl-grid-column>
                </pl-grid>
                <pl-dataset id="dsEmployees" data="{{data}}" endpoint="/employee/list"></pl-dataset>
                <pl-action args="[[_compose('id', selected.id)]]" id="aDelete" endpoint="/employee/delete"></pl-action>
            </pl-flex-layout>
		`;
    }
    onConnect() {
        this.$.dsEmployees.execute();
    }
    async onAddClick(event) {
        await this.open('level1.employee_add');
        this.$.dsEmployees.execute();
    }
    async onEditClick(event) {
        await this.open('level1.employee_add', {
            employeeId: event.model.row.id
        });

        this.$.dsEmployees.execute();
    }
    async onDeleteClick() {
        await this.$.aDelete.execute();
        this.$.dsEmployees.execute();
    }
}