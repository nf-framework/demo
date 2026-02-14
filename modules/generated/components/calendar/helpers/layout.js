export function isAllDay(event) {
  const start = new Date(event.start);
  const end = new Date(event.end);
  return event.allDay || start.toDateString() !== end.toDateString() || (end - start) >= 24 * 60 * 60 * 1000;
}

export function isPast(eventOrSpan) {
  const now = new Date();
  if (eventOrSpan?.ev) {
    return new Date(eventOrSpan.ev.end) < now;
  }
  return new Date(eventOrSpan.end) < now;
}

export function isoWeek(dateValue) {
  const date = new Date(Date.UTC(
    dateValue.getFullYear(),
    dateValue.getMonth(),
    dateValue.getDate()
  ));

  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);

  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
}

export function layoutDay(events) {
  const items = events
    .map((ev) => {
      const s = new Date(ev.start);
      const e = new Date(ev.end);
      const startMin = s.getHours() * 60 + s.getMinutes();
      const endMin = Math.max(startMin + 15, e.getHours() * 60 + e.getMinutes());

      return {
        ev,
        startMin,
        endMin,
        top: startMin,
        height: endMin - startMin
      };
    })
    .sort((a, b) => a.startMin - b.startMin || a.endMin - b.endMin);

  let active = [];
  let cluster = -1;

  for (const item of items) {
    active = active.filter((x) => x.endMin > item.startMin);
    const used = new Set(active.map((x) => x.col));

    let col = 0;
    while (used.has(col)) col++;

    item.col = col;

    if (active.length === 0) {
      cluster += 1;
      item.cluster = cluster;
      item.maxCol = col;
    } else {
      item.cluster = active[0].cluster;
    }

    active.forEach((x) => {
      x.maxCol = Math.max(x.maxCol ?? 0, col);
    });

    item.maxCol = Math.max(item.maxCol ?? 0, col);
    active.push(item);
  }

  const clusters = new Map();
  for (const item of items) {
    const rec = clusters.get(item.cluster) || { maxCol: 0, items: [] };
    rec.maxCol = Math.max(rec.maxCol, item.maxCol ?? item.col);
    rec.items.push(item);
    clusters.set(item.cluster, rec);
  }

  clusters.forEach(({ maxCol, items: clusterItems }) => {
    const cols = (maxCol | 0) + 1;
    clusterItems.forEach((item) => {
      item.cols = cols;
      item.leftPct = (100 * item.col) / cols;
      item.widthPct = 100 / cols;
    });
  });

  return items;
}

export function packWeekSpans(weekStart, events) {
  const start = new Date(weekStart);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 7);

  const spans = [];

  for (const ev of events) {
    if (!isAllDay(ev)) continue;

    const s = new Date(ev.start);
    const e = new Date(ev.end);

    const sC = new Date(Math.max(+s, +start));
    const eC = new Date(Math.min(+e, +end));

    if (!(sC < eC)) continue;

    const startIdx = Math.floor((sC - start) / (24 * 60 * 60 * 1000));
    const endIdx = Math.floor(((eC - 1) - start) / (24 * 60 * 60 * 1000));
    spans.push({ ev, startIdx, endIdx });
  }

  spans.sort((a, b) => a.startIdx - b.startIdx || a.endIdx - b.endIdx);

  const rows = [];
  for (const span of spans) {
    let placed = false;
    for (const row of rows) {
      if (row.every((r) => span.endIdx < r.startIdx || span.startIdx > r.endIdx)) {
        row.push(span);
        placed = true;
        break;
      }
    }
    if (!placed) rows.push([span]);
  }

  return rows;
}
