const ALLOWED_TAGS = new Set([
  'a', 'b', 'blockquote', 'br', 'code', 'div', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'hr', 'i', 'li', 'mark', 'ol', 'p', 'pre', 's', 'small', 'span', 'strong', 'sub', 'sup',
  'table', 'tbody', 'td', 'th', 'thead', 'tfoot', 'tr', 'u', 'ul'
]);

const BLOCKED_TAGS = new Set([
  'script', 'style', 'iframe', 'object', 'embed', 'link', 'meta', 'base',
  'form', 'input', 'button', 'textarea', 'select', 'option', 'svg', 'math'
]);

const GLOBAL_ATTRS = new Set([
  'class', 'title', 'role', 'aria-label', 'aria-hidden', 'aria-describedby', 'aria-labelledby'
]);

const TAG_ATTRS = {
  a: new Set(['href', 'target', 'rel', 'title']),
  td: new Set(['colspan', 'rowspan']),
  th: new Set(['colspan', 'rowspan'])
};

const SAFE_TARGETS = new Set(['_blank', '_self']);
const SAFE_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);

function sanitizeClassList(value) {
  const clean = String(value || '')
    .split(/\s+/)
    .filter((token) => /^[a-zA-Z0-9_-]+$/.test(token));
  return clean.join(' ');
}

function sanitizeSpanValue(value) {
  const parsed = Number.parseInt(String(value || ''), 10);
  if (!Number.isFinite(parsed)) return '';
  const normalized = Math.max(1, Math.min(24, parsed));
  return String(normalized);
}

function sanitizeUrl(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if (raw.startsWith('#') || raw.startsWith('/')) return raw;
  try {
    const url = new URL(raw, window.location.origin);
    if (!SAFE_PROTOCOLS.has(url.protocol)) return '';
    return url.toString();
  } catch {
    return '';
  }
}

function sanitizeElement(node) {
  const tag = node.tagName.toLowerCase();
  if (BLOCKED_TAGS.has(tag)) {
    node.remove();
    return 'removed';
  }

  if (!ALLOWED_TAGS.has(tag)) {
    const children = Array.from(node.childNodes);
    if (children.length) {
      node.replaceWith(...children);
      return { status: 'unwrapped', next: children };
    }
    node.remove();
    return 'removed';
  }

  const attrs = Array.from(node.attributes);
  for (const attr of attrs) {
    const name = attr.name.toLowerCase();
    const value = attr.value;
    const allowed = GLOBAL_ATTRS.has(name) || TAG_ATTRS[tag]?.has(name);

    if (!allowed || name.startsWith('on')) {
      node.removeAttribute(attr.name);
      continue;
    }

    if (name === 'class') {
      const className = sanitizeClassList(value);
      if (className) node.setAttribute('class', className);
      else node.removeAttribute('class');
      continue;
    }

    if (name === 'href') {
      const safeHref = sanitizeUrl(value);
      if (!safeHref) {
        node.removeAttribute('href');
      } else {
        node.setAttribute('href', safeHref);
      }
      continue;
    }

    if (name === 'target') {
      const normalized = String(value || '').toLowerCase();
      if (!SAFE_TARGETS.has(normalized)) node.removeAttribute('target');
      continue;
    }

    if (name === 'rel') {
      const rel = String(value || '')
        .split(/\s+/)
        .map((part) => part.trim().toLowerCase())
        .filter((part) => ['noopener', 'noreferrer', 'nofollow'].includes(part));
      if (rel.length) node.setAttribute('rel', rel.join(' '));
      else node.removeAttribute('rel');
      continue;
    }

    if (name === 'colspan' || name === 'rowspan') {
      const span = sanitizeSpanValue(value);
      if (span) node.setAttribute(name, span);
      else node.removeAttribute(name);
    }
  }

  if (tag === 'a' && node.getAttribute('target') === '_blank') {
    const rel = new Set(
      String(node.getAttribute('rel') || '')
        .split(/\s+/)
        .map((part) => part.trim().toLowerCase())
        .filter(Boolean)
    );
    rel.add('noopener');
    rel.add('noreferrer');
    node.setAttribute('rel', Array.from(rel).join(' '));
  }

  return 'kept';
}

function sanitizeTree(root) {
  const queue = Array.from(root.childNodes);
  while (queue.length) {
    const node = queue.shift();
    if (!node) continue;

    if (node.nodeType === Node.COMMENT_NODE) {
      node.remove();
      continue;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) continue;

    const result = sanitizeElement(node);
    if (result === 'kept') {
      queue.unshift(...Array.from(node.childNodes));
      continue;
    }

    if (result && typeof result === 'object' && result.status === 'unwrapped') {
      queue.unshift(...(result.next || []));
    }
  }
}

export function sanitizeRichHtml(input) {
  if (typeof document === 'undefined') return '';
  const raw = String(input ?? '');
  if (!raw.trim()) return '';

  const template = document.createElement('template');
  template.innerHTML = raw;
  sanitizeTree(template.content);
  return template.innerHTML;
}

