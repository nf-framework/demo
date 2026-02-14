import { html, css } from 'polylib';
import { PlForm } from '@nfjs/front-pl/components/pl-form.js';
import '@plcmp/pl-flex-layout';
import '@plcmp/pl-input';
import '@plcmp/pl-badge';

export default class GeneratedDashboard extends PlForm {
  static properties = {
    formTitle: {
      type: String,
      value: 'Dashboard'
    },
    rootData: {
      type: Object,
      value: () => ({})
    },
    modules: {
      type: Array,
      value: () => ([])
    },
    selectedModule: {
      type: Object,
      value: null
    }
  };

  static css = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
    }

    pl-flex-layout[fit] {
      min-width: 0;
      min-height: 0;
    }

    pl-input {
      min-width: 260px;
      flex: 1;
    }

    pl-grid {
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      border: 1px solid var(--pl-grey-light, #e5e7eb);
      border-radius: var(--pl-border-radius, 10px);
      overflow: hidden;
    }
  `;

  static template = html`
    <pl-flex-layout vertical fit gap="12">
      <pl-flex-layout wrap gap="8">
        <pl-badge>Пакет: [[rootData.name]]</pl-badge>
        <pl-badge>Версия: [[rootData.version]]</pl-badge>
        <pl-badge>Модулей: [[modules.length]]</pl-badge>
      </pl-flex-layout>

      <pl-flex-layout wrap gap="8">
        <pl-input label="Наименование" value="[[rootData.name]]" readonly></pl-input>
        <pl-input label="Версия" value="[[rootData.version]]" readonly></pl-input>
      </pl-flex-layout>

      <pl-input label="Описание" value="[[rootData.description]]" readonly></pl-input>

      <pl-flex-layout fit>
        <pl-grid data="{{modules}}" selected="{{selectedModule}}">
          <pl-grid-column sortable field="name" header="Модуль" resizable></pl-grid-column>
          <pl-grid-column sortable field="version" header="Версия" width="140" resizable></pl-grid-column>
        </pl-grid>
      </pl-flex-layout>
    </pl-flex-layout>
    <pl-action id="aPackages" endpoint="/front/action/getPackages"></pl-action>
  `;

  onConnect() {
    this.$.aPackages.execute().then((res) => {
      this.rootData = res.root || {};
      this.modules = Array.isArray(res.modules) ? res.modules : [];
    });
  }
}
