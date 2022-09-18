import { html, css } from "polylib";
import { PlForm } from "@nfjs/front-pl/components/pl-form.js";

export default class PolyLib extends PlForm {
    static get properties() {
        return {
            data: { value: () => { [] } },
            selected: { value: () => ({}) },
            formTitle: {
                type: String,
                value: 'Сотрудники'
            }
        }
    }

    static get template() {
        return html`
            <pl-flex-layout scrollable vertical fit>
                <pl-grid data="{{data}}" selected="{{selected}}" on-row-dblclick="[[onEditClick]]">
                    <pl-flex-layout stretch align="flex-end" slot="top-toolbar">
                        <pl-filter-container data="{{data}}" id="fltr">
                            <pl-filter-item field="fio" operator="like_both">
                                <pl-input label="ФИО"></pl-input>
                            </pl-filter-item>
                            <pl-filter-item field="birthdate" operator="=" cast="date">
                                <pl-datetime label="Дата рождения"></pl-datetime>
                            </pl-filter-item>
                        </pl-filter-container>
                        <pl-button variant="ghost" label="Найти" on-click="[[onSearchClick]]">
                            <pl-icon iconset="pl-default" size="16" icon="search" slot="prefix"></pl-icon>
                        </pl-button>
                        <pl-button variant="link" label="Сбросить" on-click="[[onClearClick]]">
                            <pl-icon iconset="pl-default" size="16" icon="close" slot="prefix"></pl-icon>
                        </pl-button>
                        <pl-button variant="primary" label="Добавить" on-click="[[onAddClick]]">
                            <pl-icon iconset="pl-default" size="16" icon="plus" slot="prefix"></pl-icon>
                        </pl-button>
                    </pl-flex-layout>
                    <pl-grid-column sortable field="fio" header="ФИО" resizable></pl-grid-column>
                    <pl-grid-column sortable field="gender_name" header="Пол" width="130" resizable></pl-grid-column>
                    <pl-grid-column sortable field="birthdate" header="Дата рождения" width="150" kind="date" resizable>
                    </pl-grid-column>
                    <pl-grid-column width="90" action>
                        <template>
                            <pl-flex-layout>
                                <pl-icon-button variant="link" iconset="pl-default" size="16" icon="pencil"
                                    on-click="[[onEditClick]]"></pl-icon-button>
                                <pl-icon-button variant="link" iconset="pl-default" size="16" icon="trashcan"
                                    on-click="[[onDeleteClick]]"></pl-icon-button>
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
    onSearchClick() {
        this.$.fltr.applyFilters();
        this.$.dsEmployees.execute();
    }
    onClearClick() {
        this.$.fltr.clearFilters();
        this.$.dsEmployees.execute();
    }
    async onAddClick(event) {
        await this.open('level2.employee_add');
        this.$.dsEmployees.execute();
    }
    async onEditClick(event) {
        await this.open('level2.employee_add', {
            employeeId: event.model.row.id
        });

        this.$.dsEmployees.execute();
    }
    async onDeleteClick() {
        if (await this.showConfirm('Вы уверены что хотите удалить запись?', {
            buttons: [{
                label: 'Нет',
                variant: 'secondary',
                action: false,
            },
            {
                label: 'Удалить',
                variant: 'primary',
                negative: true,
                action: true
            }]
        })) {
            await this.$.aDelete.execute();
            this.$.dsEmployees.execute();
        }
    }
}