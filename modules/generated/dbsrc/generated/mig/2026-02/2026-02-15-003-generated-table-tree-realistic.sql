create table if not exists generated.table_tree (
    id bigint primary key,
    pid bigint,
    node_name text not null,
    node_type text not null,
    environment text,
    severity text,
    assignee text,
    status text,
    start_at timestamp,
    due_date date,
    _haschildren boolean not null default false,
    _opened boolean not null default false,
    sort_order bigint not null
);

create index if not exists ix_table_tree_pid on generated.table_tree(pid);

create or replace view generated.v4table_tree as
select main.*
  from generated.table_tree main;

truncate table generated.table_tree;

with
domains as (
    select
        d as d_idx,
        d::bigint as id,
        null::bigint as pid,
        (array['Продуктовая разработка', 'Платформа данных', 'Инфраструктура'])[d] as node_name
    from generate_series(1, 3) as d
),
systems as (
    select
        d.d_idx,
        s as s_idx,
        (d.id * 100 + s)::bigint as id,
        d.id as pid,
        (array['Клиентские приложения', 'API контур', 'Интеграции', 'Операционная поддержка'])[s]
          || ' / ' || d.node_name as node_name
    from domains d
    cross join generate_series(1, 4) as s
),
services as (
    select
        s.d_idx,
        s.s_idx,
        v as v_idx,
        (s.id * 100 + v)::bigint as id,
        s.id as pid,
        (array['Auth Service', 'Billing Hub', 'Catalog API'])[v] || ' #' || s.s_idx::text as node_name,
        (array['prod', 'stage', 'dev'])[((v + s.s_idx) % 3) + 1] as environment
    from systems s
    cross join generate_series(1, 3) as v
),
modules as (
    select
        srv.d_idx,
        srv.s_idx,
        srv.v_idx,
        m as m_idx,
        (srv.id * 100 + m)::bigint as id,
        srv.id as pid,
        (array['Core', 'Frontend', 'Data Pipeline'])[m] || ' модуль' as node_name,
        srv.environment
    from services srv
    cross join generate_series(1, 3) as m
),
tasks as (
    select
        m.d_idx,
        m.s_idx,
        m.v_idx,
        m.m_idx,
        t as t_idx,
        (m.id * 100 + t)::bigint as id,
        m.id as pid,
        'TASK-' || lpad((m.d_idx * 10000 + m.s_idx * 1000 + m.v_idx * 100 + m.m_idx * 10 + t)::text, 6, '0') as node_name,
        m.environment,
        (array['P1', 'P2', 'P3'])[((m.v_idx + t) % 3) + 1] as severity,
        (array['Иван Петров', 'Анна Смирнова', 'Дмитрий Кузнецов', 'Ольга Иванова', 'Сергей Волков', 'Мария Федорова', 'Павел Егоров', 'Екатерина Орлова'])[((m.d_idx + m.s_idx + m.v_idx + m.m_idx + t) % 8) + 1] as assignee,
        (array['В работе', 'На контроле', 'Риск', 'Готово'])[((m.m_idx + t) % 4) + 1] as status,
        timestamp '2026-02-01 09:00:00' + (((m.d_idx * 500 + m.s_idx * 90 + m.v_idx * 30 + m.m_idx * 10 + t) % 4000) * interval '5 minute') as start_at,
        (date '2026-02-01' + ((m.d_idx * 31 + m.s_idx * 13 + m.v_idx * 7 + m.m_idx * 3 + t) % 60)) as due_date
    from modules m
    cross join generate_series(1, 4) as t
)
insert into generated.table_tree (
    id,
    pid,
    node_name,
    node_type,
    environment,
    severity,
    assignee,
    status,
    start_at,
    due_date,
    _haschildren,
    _opened,
    sort_order
)
select
    x.id,
    x.pid,
    x.node_name,
    x.node_type,
    x.environment,
    x.severity,
    x.assignee,
    x.status,
    x.start_at,
    x.due_date,
    x._haschildren,
    x._opened,
    x.sort_order
from (
    select
        d.id,
        d.pid,
        d.node_name,
        'Направление'::text as node_type,
        null::text as environment,
        null::text as severity,
        null::text as assignee,
        ('Систем: 4')::text as status,
        null::timestamp as start_at,
        null::date as due_date,
        true as _haschildren,
        false as _opened,
        (d.d_idx::bigint * 1000000000000) as sort_order
    from domains d

    union all

    select
        s.id,
        s.pid,
        s.node_name,
        'Система'::text as node_type,
        null::text as environment,
        null::text as severity,
        null::text as assignee,
        ('Сервисов: 3')::text as status,
        null::timestamp as start_at,
        null::date as due_date,
        true as _haschildren,
        false as _opened,
        (s.d_idx::bigint * 1000000000000)
          + (s.s_idx::bigint * 10000000000) as sort_order
    from systems s

    union all

    select
        srv.id,
        srv.pid,
        srv.node_name,
        'Сервис'::text as node_type,
        srv.environment,
        null::text as severity,
        null::text as assignee,
        ('Модулей: 3')::text as status,
        null::timestamp as start_at,
        null::date as due_date,
        true as _haschildren,
        false as _opened,
        (srv.d_idx::bigint * 1000000000000)
          + (srv.s_idx::bigint * 10000000000)
          + (srv.v_idx::bigint * 100000000) as sort_order
    from services srv

    union all

    select
        m.id,
        m.pid,
        m.node_name,
        'Модуль'::text as node_type,
        m.environment,
        null::text as severity,
        null::text as assignee,
        ('Задач: 4')::text as status,
        null::timestamp as start_at,
        null::date as due_date,
        true as _haschildren,
        false as _opened,
        (m.d_idx::bigint * 1000000000000)
          + (m.s_idx::bigint * 10000000000)
          + (m.v_idx::bigint * 100000000)
          + (m.m_idx::bigint * 1000000) as sort_order
    from modules m

    union all

    select
        t.id,
        t.pid,
        t.node_name,
        'Задача'::text as node_type,
        t.environment,
        t.severity,
        t.assignee,
        t.status,
        t.start_at,
        t.due_date,
        false as _haschildren,
        false as _opened,
        (t.d_idx::bigint * 1000000000000)
          + (t.s_idx::bigint * 10000000000)
          + (t.v_idx::bigint * 100000000)
          + (t.m_idx::bigint * 1000000)
          + (t.t_idx::bigint * 1000) as sort_order
    from tasks t
) as x
order by x.sort_order;
