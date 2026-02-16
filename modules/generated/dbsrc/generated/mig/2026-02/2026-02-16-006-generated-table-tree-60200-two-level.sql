truncate table generated.table_tree;

with
parents as (
    select
        p as parent_idx,
        (100000 + p)::bigint as id,
        null::bigint as pid,
        ('Направление #' || lpad(p::text, 3, '0'))::text as node_name,
        (array['prod', 'stage', 'dev'])[1 + ((p - 1) % 3)]::text as environment,
        (array['P1', 'P2', 'P3'])[1 + ((p - 1) % 3)]::text as severity,
        (array[
            'Иван Петров',
            'Анна Смирнова',
            'Дмитрий Кузнецов',
            'Ольга Иванова',
            'Сергей Волков',
            'Мария Федорова',
            'Павел Егоров',
            'Екатерина Орлова',
            'Алексей Смирнов',
            'Юлия Григорьева'
        ])[1 + ((p - 1) % 10)]::text as assignee,
        ('Команд: 300')::text as status,
        (timestamp '2026-02-01 09:00:00' + ((p - 1) * interval '2 hour'))::timestamp as start_at,
        (date '2026-02-01' + ((p - 1) % 28))::date as due_date,
        (p::bigint * 1000000) as sort_order
    from generate_series(1, 200) as p
),
children as (
    select
        p.parent_idx,
        c as child_idx,
        (p.id * 1000 + c)::bigint as id,
        p.id as pid,
        ('Сервис ' || lpad(c::text, 3, '0') || ' / ' || p.node_name)::text as node_name,
        (array['prod', 'stage', 'dev'])[1 + ((p.parent_idx + c - 2) % 3)]::text as environment,
        (array['P1', 'P2', 'P3'])[1 + ((c - 1) % 3)]::text as severity,
        (array[
            'Иван Петров',
            'Анна Смирнова',
            'Дмитрий Кузнецов',
            'Ольга Иванова',
            'Сергей Волков',
            'Мария Федорова',
            'Павел Егоров',
            'Екатерина Орлова',
            'Алексей Смирнов',
            'Юлия Григорьева'
        ])[1 + ((p.parent_idx + c - 2) % 10)]::text as assignee,
        (array['В работе', 'На контроле', 'Риск', 'Готово'])[1 + ((p.parent_idx + c - 2) % 4)]::text as status,
        (timestamp '2026-02-01 09:00:00' + (((p.parent_idx - 1) * 300 + c - 1) * interval '35 minute'))::timestamp as start_at,
        (date '2026-02-01' + ((p.parent_idx + c - 2) % 28))::date as due_date,
        (p.sort_order + c::bigint * 1000) as sort_order
    from parents p
    cross join generate_series(1, 300) as c
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
        p.id,
        p.pid,
        p.node_name,
        'Направление'::text as node_type,
        p.environment,
        p.severity,
        p.assignee,
        p.status,
        p.start_at,
        p.due_date,
        true as _haschildren,
        false as _opened,
        p.sort_order
    from parents p

    union all

    select
        c.id,
        c.pid,
        c.node_name,
        'Сервис'::text as node_type,
        c.environment,
        c.severity,
        c.assignee,
        c.status,
        c.start_at,
        c.due_date,
        false as _haschildren,
        false as _opened,
        c.sort_order
    from children c
) as x
order by x.sort_order;
