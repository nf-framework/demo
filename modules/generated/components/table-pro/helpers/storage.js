export function saveTableSettings(settingsKey, settings) {
  if (!settingsKey || typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(settingsKey, JSON.stringify(settings));
  } catch (error) {
    // noop: quota exceeded / private mode
  }
}

export function loadTableSettings(settingsKey) {
  if (!settingsKey || typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(settingsKey);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}

export function clearTableSettings(settingsKey) {
  if (!settingsKey || typeof localStorage === 'undefined') return;
  try {
    localStorage.removeItem(settingsKey);
  } catch (error) {
    // noop
  }
}
