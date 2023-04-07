import { html } from "polylib";
import { PlForm } from "@nfjs/front-pl/components/pl-form.js";

export default class EmployeeAdd extends PlForm {
    static properties = {
        cards: {
            type: Array,
            observer: '_cardsObserver'
        },
        position_types: {
            type: Array,
            value: () => [
                {
                    value: 1,
                    text: "Стажер"
                },
                {
                    value: 2,
                    text: "Директор"
                }
            ]
        },
        inoperability_types: {
            type: Array,
            value: () => [
                {
                    value: 1,
                    text: "Отпуск без сохранения заработной платы"
                },
                {
                    value: 2,
                    text: "Иные причины"
                }
            ]
        },
        invalid: {
            value: false
        }
    }

    static template = html`
        <pl-valid-observer invalid="{{invalid}}"></pl-valid-observer>
        <pl-flex-layout vertical>
            <h3>Личное дело</h3>
            <pl-button variant="ghost" label="Добавить личное дело" on-click="[[onCardAddClick]]">
                <pl-icon iconset="pl-default" size="16" icon="plus" slot="prefix"></pl-icon>
            </pl-button>
            <template d:repeat="{{cards}}">
                <pl-card header="Личное дело">
                    <pl-icon-button variant="ghost" iconset="pl-default" size="16" icon="trashcan" slot="tools" on-click="[[onCardDelClick]]"></pl-icon-button>
                    <pl-flex-layout vertical>
                        <pl-datetime required max="[[item.date_end]]" value="{{item.date_begin}}" orientation="horizontal" label="Дата начала работы"></pl-datetime>
                        <pl-datetime min="[[item.date_begin]]" value="{{item.date_end}}" orientation="horizontal" label="Дата окончания работы"></pl-datetime>
                        <pl-combobox orientation="horizontal" data="[[position_types]]" label="Должность" value="{{item.position}}" required></pl-combobox>
                        <pl-input type="number" step="0.1" min="0.1" max="1.5" orientation="horizontal" label="Ставка" required value="{{item.rate}}"></pl-input>

                        <h4>Причины временной нетрудоспособности</h4>
                        <pl-button variant="ghost" label="Добавить причину временной нетрудоспособности" on-click="[[onInoperabilityAddClick]]">
                            <pl-icon iconset="pl-default" size="16" icon="plus" slot="prefix"></pl-icon>
                        </pl-button>
                        <template d:repeat="{{item.inoperabilities}}" d:as="inop">
                            <pl-flex-layout vertical stretch>
                                <pl-flex-layout align="flex-end">
                                    <pl-datetime required max="[[inop.date_end]]" value="{{inop.date_begin}}" orientation="horizontal" label="Дата начала"></pl-datetime>
                                    <pl-datetime min="[[inop.date_begin]]" value="{{inop.date_end}}" orientation="horizontal" label="Дата окончания"></pl-datetime>
                                </pl-flex-layout>
                                <pl-combobox orientation="horizontal" data="[[inoperability_types]]" label="Причина" value="{{inop.type}}" required></pl-combobox>
                                <pl-textarea stretch label="Описание причины" required disabled="[[!_eq(inop.type, '2')]]" value="{{inop.other_type_description}}" orientation="horizontal" ></pl-textarea>
                            </pl-flex-layout>
                        </template>
                    </pl-flex-layout>
                </pl-card>
            </template>
        </pl-flex-layout>
    `;

    onCardAddClick() {
        this.push('cards', {
            date_begin: null,
            date_end: null,
            inoperabilities: []
        });
    }

    onCardDelClick(event) {
        this.splice('cards', this.cards.indexOf(event.model.item), 1);
    }

    onInoperabilityAddClick(event) {
        this.push(`cards.${this.cards.indexOf(event.model.item)}.inoperabilities`, {});
    }

    _cardsObserver(val, old, mut) {
        const m = mut.path.match(/^cards\.(\d*)\.inoperabilities.(\d*).type/);
        if (m) {
            if (val[m[1]].inoperabilities[m[2]].type) {
                this.set(`cards.${m[1]}.inoperabilities.${m[2]}.other_type_description`, null);
            }
        }
    }
    _eq(val, type) {
        return val == type;
    }
}