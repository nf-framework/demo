truncate table generated.table_settings restart identity cascade;
truncate table generated.table_span restart identity cascade;
truncate table generated.table_deep_groups restart identity cascade;
truncate table generated.table_master restart identity cascade;
truncate table generated.table_inline_edit restart identity cascade;

insert into generated.table_settings (
    incident_id,
    created_at,
    service,
    environment,
    severity,
    status,
    region,
    channel,
    category,
    summary,
    updated_at,
    owner_name,
    squad,
    owner_role,
    sla_response_min,
    sla_repair_min,
    sla_risk,
    plan_hours,
    fact_hours,
    variance_hours
)
select
    'INC-2026-' || lpad(gs::text, 6, '0') as incident_id,
    timestamp '2026-02-01 08:30:00' + ((gs - 1) * interval '19 minute') as created_at,
    (array['API Gateway', 'Web Frontend', 'Payments', 'Search Service', 'Auth Service', 'Notification Hub', 'Catalog Service', 'Release Manager'])[((gs - 1) % 8) + 1] as service,
    (array['prod', 'prod', 'stage', 'prod', 'prod', 'stage'])[((gs - 1) % 6) + 1] as environment,
    (array['P1', 'P2', 'P3'])[((gs - 1) % 3) + 1] as severity,
    (array['В работе', 'Наблюдение', 'Решен', 'Эскалация'])[((gs - 1) % 4) + 1] as status,
    (array['ru-central1', 'ru-west1', 'ru-siberia1'])[((gs - 1) % 3) + 1] as region,
    (array['Мониторинг', 'Support L1', 'Support L2', 'PagerDuty'])[((gs - 1) % 4) + 1] as channel,
    (array['Доступность', 'Производительность', 'Интеграция', 'Безопасность', 'Данные'])[((gs - 1) % 5) + 1] as category,
    'Инцидент #' || gs || ': автоматически сгенерированная запись' as summary,
    timestamp '2026-02-01 09:05:00' + ((gs - 1) * interval '19 minute') as updated_at,
    (array['Иван Петров', 'Анна Смирнова', 'Дмитрий Кузнецов', 'Ольга Иванова', 'Сергей Волков', 'Мария Федорова', 'Павел Егоров', 'Екатерина Орлова'])[((gs - 1) % 8) + 1] as owner_name,
    (array['Платформа API', 'Frontend', 'Billing', 'SRE', 'Mobile', 'Data'])[((gs - 1) % 6) + 1] as squad,
    (array['Backend', 'Frontend', 'DevOps', 'QA', 'Team Lead'])[((gs - 1) % 5) + 1] as owner_role,
    5 + ((gs - 1) % 7) * 5 as sla_response_min,
    60 + ((gs - 1) % 9) * 30 as sla_repair_min,
    (array['Низкий', 'Средний', 'Высокий'])[((gs - 1) % 3) + 1] as sla_risk,
    (2 + ((gs - 1) % 8))::numeric(8,2) as plan_hours,
    (1.5 + (((gs - 1) % 8) * 0.9))::numeric(8,2) as fact_hours,
    ((1.5 + (((gs - 1) % 8) * 0.9)) - (2 + ((gs - 1) % 8)))::numeric(8,2) as variance_hours
from generate_series(1, 300) as gs;

insert into generated.table_span (
    portfolio,
    project_code,
    project_name,
    customer,
    project_manager,
    stage,
    priority,
    annual_plan_k,
    jan_k,
    feb_k,
    mar_k,
    apr_k,
    may_k,
    jun_k,
    jul_k,
    aug_k,
    sep_k,
    oct_k,
    nov_k,
    dec_k
)
with base as (
    select
        gs,
        30 + ((gs - 1) % 25) as jan_k,
        31 + ((gs + 2) % 25) as feb_k,
        32 + ((gs + 4) % 25) as mar_k,
        33 + ((gs + 6) % 25) as apr_k,
        34 + ((gs + 8) % 25) as may_k,
        35 + ((gs + 10) % 25) as jun_k,
        36 + ((gs + 12) % 25) as jul_k,
        37 + ((gs + 14) % 25) as aug_k,
        38 + ((gs + 16) % 25) as sep_k,
        39 + ((gs + 18) % 25) as oct_k,
        40 + ((gs + 20) % 25) as nov_k,
        41 + ((gs + 22) % 25) as dec_k
    from generate_series(1, 300) as gs
)
select
    (array['Core Platform', 'Client Apps', 'Data Intelligence', 'Operations', 'Security'])[((gs - 1) % 5) + 1] as portfolio,
    'PRJ-' || lpad(gs::text, 4, '0') as project_code,
    'Проект #' || gs || ': развитие платформы' as project_name,
    (array['B2B', 'B2C', 'Internal'])[((gs - 1) % 3) + 1] as customer,
    (array['Иван Петров', 'Анна Смирнова', 'Дмитрий Кузнецов', 'Ольга Иванова', 'Сергей Волков', 'Мария Федорова'])[((gs - 1) % 6) + 1] as project_manager,
    (array['Discovery', 'Execution', 'Delivery'])[((gs - 1) % 3) + 1] as stage,
    (array['Высокий', 'Средний', 'Низкий'])[((gs - 1) % 3) + 1] as priority,
    (jan_k + feb_k + mar_k + apr_k + may_k + jun_k + jul_k + aug_k + sep_k + oct_k + nov_k + dec_k) as annual_plan_k,
    jan_k, feb_k, mar_k, apr_k, may_k, jun_k, jul_k, aug_k, sep_k, oct_k, nov_k, dec_k
from base;

insert into generated.table_deep_groups (
    service,
    owner,
    jan_plan,
    jan_fact,
    feb_plan,
    feb_fact,
    apr_plan,
    apr_fact,
    may_plan,
    may_fact,
    inc_open,
    inc_closed,
    sla_hit_pct,
    status
)
select
    (array['API Gateway', 'Web Frontend', 'Payments', 'Auth', 'Notifications'])[((gs - 1) % 5) + 1] as service,
    (array['Иван Петров', 'Анна Смирнова', 'Дмитрий Кузнецов', 'Ольга Иванова', 'Сергей Волков', 'Мария Федорова'])[((gs - 1) % 6) + 1] as owner,
    20 + ((gs - 1) % 15) as jan_plan,
    18 + ((gs + 1) % 15) as jan_fact,
    21 + ((gs + 2) % 15) as feb_plan,
    19 + ((gs + 3) % 15) as feb_fact,
    22 + ((gs + 4) % 15) as apr_plan,
    20 + ((gs + 5) % 15) as apr_fact,
    23 + ((gs + 6) % 15) as may_plan,
    21 + ((gs + 7) % 15) as may_fact,
    ((gs - 1) % 5) as inc_open,
    ((gs + 1) % 7) as inc_closed,
    88 + ((gs - 1) % 12) as sla_hit_pct,
    (array['Стабильно', 'Под наблюдением', 'Риск'])[((gs - 1) % 3) + 1] as status
from generate_series(1, 300) as gs;

insert into generated.table_master (
    team_id,
    team_name,
    manager,
    direction,
    status,
    current_sprint,
    velocity,
    tech_debt_pct,
    vacation_load_pct,
    capacity_pct,
    next_milestone,
    open_tasks,
    in_progress_tasks,
    done_tasks,
    sla_violations,
    incident_rate,
    oncall_count,
    deploy_frequency,
    cycle_time_days,
    last_release
)
select
    'TEAM-' || lpad(gs::text, 4, '0') as team_id,
    'Команда ' || gs as team_name,
    (array['Иван Петров', 'Анна Смирнова', 'Дмитрий Кузнецов', 'Ольга Иванова', 'Сергей Волков', 'Мария Федорова', 'Павел Егоров'])[((gs - 1) % 7) + 1] as manager,
    (array['Платформа', 'Frontend', 'Backend', 'Data', 'QA', 'DevOps'])[((gs - 1) % 6) + 1] as direction,
    (array['Стабильно', 'Под контролем', 'Риск'])[((gs - 1) % 3) + 1] as status,
    'SPR-' || (20 + ((gs - 1) % 40)) as current_sprint,
    18 + ((gs - 1) % 28) as velocity,
    8 + ((gs - 1) % 27) as tech_debt_pct,
    4 + ((gs - 1) % 22) as vacation_load_pct,
    65 + ((gs - 1) % 35) as capacity_pct,
    'M' || ((gs - 1) % 12 + 1) || '-2026' as next_milestone,
    10 + ((gs - 1) % 24) as open_tasks,
    6 + ((gs + 3) % 18) as in_progress_tasks,
    9 + ((gs + 5) % 26) as done_tasks,
    ((gs - 1) % 5) as sla_violations,
    (0.3 + (((gs - 1) % 11) * 0.17))::numeric(8,2) as incident_rate,
    1 + ((gs - 1) % 7) as oncall_count,
    2 + ((gs - 1) % 10) as deploy_frequency,
    2 + ((gs - 1) % 14) as cycle_time_days,
    date '2026-01-01' + ((gs - 1) % 45) as last_release
from generate_series(1, 300) as gs;

insert into generated.table_inline_edit (
    ticket,
    title,
    assignee,
    team,
    priority,
    status,
    start_at,
    due_date,
    meeting_time,
    estimate_hours,
    progress_pct,
    remote,
    notes
)
select
    'DEV-' || lpad((3000 + gs)::text, 5, '0') as ticket,
    'Задача #' || gs || ': автоматизированная запись' as title,
    (array['Иван Петров', 'Анна Смирнова', 'Дмитрий Кузнецов', 'Ольга Иванова', 'Сергей Волков', 'Мария Федорова', 'Павел Егоров', 'Екатерина Орлова'])[((gs - 1) % 8) + 1] as assignee,
    (array['Платформа', 'Клиентские приложения', 'Платформа данных', 'DevOps', 'QA'])[((gs - 1) % 5) + 1] as team,
    (array['P1', 'P2', 'P3'])[((gs - 1) % 3) + 1] as priority,
    (array['Активно', 'В работе', 'На контроле', 'Готово'])[((gs - 1) % 4) + 1] as status,
    timestamp '2026-02-01 09:00:00' + ((gs - 1) * interval '35 minute') as start_at,
    (date '2026-02-01' + ((gs - 1) % 20)) as due_date,
    (array['09:00', '09:30', '10:00', '11:30', '13:00', '15:30', '17:00'])[((gs - 1) % 7) + 1] as meeting_time,
    (2 + ((gs - 1) % 9))::numeric(8,2) as estimate_hours,
    8 + ((gs - 1) % 93) as progress_pct,
    ((gs - 1) % 2 = 0) as remote,
    (array['Без блокеров', 'Нужен контроль архитектора', 'Ожидаем ревью', 'Требуется синхронизация с QA'])[((gs - 1) % 4) + 1] as notes
from generate_series(1, 300) as gs;
