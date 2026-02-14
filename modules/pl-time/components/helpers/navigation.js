function safeStep(step) {
  const raw = Number(step);
  if (!Number.isFinite(raw)) return 1;
  return Math.max(1, Math.floor(raw));
}

export function calcNextMinutes(baseMinutes, key, stepMinutes) {
  const base = Number(baseMinutes) || 0;
  const step = safeStep(stepMinutes);

  if (key === 'ArrowDown') return base + step;
  if (key === 'ArrowUp') return base - step;
  return base;
}

export function calcScrollTopForOption({ viewTop, viewHeight, optionTop, optionHeight }) {
  const top = Number(viewTop) || 0;
  const height = Number(viewHeight) || 0;
  const itemTop = Number(optionTop) || 0;
  const itemHeight = Number(optionHeight) || 0;

  if (height <= 0) return top;

  const viewBottom = top + height;
  const itemBottom = itemTop + itemHeight;

  if (itemTop < top) return itemTop;
  if (itemBottom > viewBottom) return itemBottom - height;
  return top;
}

