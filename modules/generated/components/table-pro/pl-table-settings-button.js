import '@plcmp/pl-icon-button';
import '@plcmp/pl-iconset-default';

class PlTableSettingsButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['variant', 'icon', 'iconset', 'title', 'disabled'];
  }

  connectedCallback() {
    this._ensureButton();
    this._syncProps();
  }

  attributeChangedCallback() {
    this._syncProps();
  }

  _ensureButton() {
    if (this._button) return;

    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: var(--pl-base-size, 32px);
        min-height: var(--pl-base-size, 32px);
      }
    `;

    const button = document.createElement('pl-icon-button');
    button.addEventListener('click', (event) => {
      if (this.hasAttribute('disabled')) return;
      event.stopPropagation();
      this.dispatchEvent(new CustomEvent('pl-table-pro-settings-toggle', {
        bubbles: true,
        composed: true
      }));
    });

    this._button = button;
    this.shadowRoot.append(style, button);
  }

  _syncProps() {
    if (!this._button) return;

    const variant = this.getAttribute('variant') || 'ghost';
    const icon = this.getAttribute('icon') || 'settings-2';
    const iconset = this.getAttribute('iconset') || 'pl-default';
    const title = this.getAttribute('title') || 'Настройки колонок';

    this._button.setAttribute('variant', variant);
    this._button.setAttribute('icon', icon);
    this._button.setAttribute('iconset', iconset);
    this._button.setAttribute('title', title);

    if (this.hasAttribute('disabled')) {
      this._button.setAttribute('disabled', '');
    } else {
      this._button.removeAttribute('disabled');
    }
  }
}

if (!customElements.get('pl-table-pro-settings-button')) {
  customElements.define('pl-table-pro-settings-button', PlTableSettingsButton);
}
