class PlTableProColumn extends HTMLElement {
  connectedCallback() {
    this.style.display = 'none';
  }
}

if (!customElements.get('pl-table-pro-column')) {
  customElements.define('pl-table-pro-column', PlTableProColumn);
}
