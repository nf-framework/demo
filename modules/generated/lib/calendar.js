import { api } from '@nfjs/core';

const ALLOWED_TYPES = new Set(['default', 'tech', 'screen', 'manager', 'offer']);

function seedEvents(base = new Date()) {
  const day = (offset = 0) => new Date(base.getFullYear(), base.getMonth(), base.getDate() + offset);
  const mk = (d, h, m, durationMin, title, type = 'default', personId = 'self') => {
    const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, m, 0, 0);
    const end = new Date(start.getTime() + durationMin * 60 * 1000);
    return {
      id: Math.random().toString(36).slice(2),
      title,
      type,
      personId,
      start: start.toISOString(),
      end: end.toISOString()
    };
  };

  return [
    mk(day(0), 9, 0, 30, 'Daily stand-up команды', 'default', 'ivan_petrov'),
    mk(day(0), 9, 30, 60, 'Код-ревью API слоя', 'screen', 'anna_smirnova'),
    mk(day(0), 10, 0, 60, 'Проверка CI/CD пайплайна', 'tech', 'dmitry_kuznetsov'),
    mk(day(0), 10, 30, 45, 'Баг-триаж релиза 2.4', 'manager', 'olga_ivanova'),
    mk(day(0), 11, 30, 60, 'Планирование спринта', 'manager', 'sergey_volkov'),
    mk(day(0), 12, 0, 60, 'Синк по backend задачам', 'default', 'self'),
    mk(day(0), 14, 0, 120, 'Проработка архитектуры кэша', 'tech', 'roman_belov'),
    mk(day(0), 15, 0, 60, 'UX-ревью личного кабинета', 'screen', 'pavel_egorov'),
    mk(day(0), 16, 0, 60, 'Синк по мобильному релизу', 'default', 'alexey_morozov'),
    mk(day(1), 10, 30, 60, 'Анализ продуктовых метрик', 'screen', 'natalia_orlova'),
    mk(day(1), 11, 0, 60, 'Нагрузочное тестирование', 'tech', 'viktoria_nikitina'),
    mk(day(1), 12, 0, 60, 'Review security чеклиста', 'tech', 'kirill_sokolov'),
    mk(day(1), 16, 0, 60, 'Подготовка релиз-нот', 'offer', 'irina_lebedeva'),
    mk(day(2), 11, 0, 60, 'Инцидент-ревью и RCA', 'manager', 'elena_zhukova'),
    mk(day(3), 13, 0, 120, 'Системный дизайн новых сервисов', 'tech', 'self'),
    {
      id: 'generated-allday-1',
      title: 'Хакатон команды платформы',
      type: 'manager',
      personId: 'sergey_volkov',
      allDay: true,
      start: new Date(base.getFullYear(), base.getMonth(), 5).toISOString(),
      end: new Date(base.getFullYear(), base.getMonth(), 7).toISOString()
    },
    {
      id: 'generated-allday-2',
      title: 'Неделя релизной стабилизации',
      type: 'offer',
      personId: 'team',
      allDay: true,
      start: new Date(base.getFullYear(), base.getMonth(), 20).toISOString(),
      end: new Date(base.getFullYear(), base.getMonth(), 24).toISOString()
    }
  ];
}

function normalizeEvent(event, index) {
  const fallbackStart = new Date();
  fallbackStart.setHours(9 + (index % 6), 0, 0, 0);

  let start = new Date(event?.start ?? fallbackStart.toISOString());
  if (Number.isNaN(start.getTime())) start = fallbackStart;

  let end = new Date(event?.end ?? new Date(start.getTime() + 60 * 60 * 1000).toISOString());
  if (Number.isNaN(end.getTime()) || end <= start) {
    end = new Date(start.getTime() + 60 * 60 * 1000);
  }

  const type = ALLOWED_TYPES.has(event?.type) ? event.type : 'default';

  return {
    id: String(event?.id || `generated-${Date.now()}-${index}`),
    title: String(event?.title || 'Без названия'),
    type,
    personId: event?.personId ? String(event.personId) : undefined,
    allDay: Boolean(event?.allDay),
    start: start.toISOString(),
    end: end.toISOString()
  };
}

let EVENTS = seedEvents();

export async function listEvents(context) {
  try {
    context.send({ data: EVENTS.map((event) => ({ ...event })) });
  } catch (error) {
    context.send(api.nfError(error).json());
  }
}

export async function saveEvents(context) {
  try {
    const incomingEvents = context.body?.args?.events;
    if (!Array.isArray(incomingEvents)) {
      throw new Error('Ожидался массив events в args.events');
    }

    EVENTS = incomingEvents.map(normalizeEvent);

    context.send({
      data: {
        count: EVENTS.length,
        updatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    context.send(api.nfError(error).json());
  }
}

export async function resetEvents(context) {
  try {
    EVENTS = seedEvents();
    context.send({
      data: {
        count: EVENTS.length,
        updatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    context.send(api.nfError(error).json());
  }
}
