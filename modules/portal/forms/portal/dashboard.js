import Dashboard2 from '/portal/forms/portal/dashboard_2.js';

export default class PortalDashboardForm extends Dashboard2 {
  static properties = {
    ...Dashboard2.properties,
    formTitle: { type: String, value: 'Портал: Главная' }
  };
}
