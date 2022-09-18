import { dbapi } from "@nfjs/back";
import { api } from '@nfjs/core';

export async function list(context) {
    try {
        const data = await dbapi.query(`select 
            id,
            trim(lastname || ' ' || firstname || ' ' || coalesce(patronymic, '')) as fio,
            case when gender = 1 then 'Мужской' else 'Женский' end as gender_name,
            gender,
            birthdate
            from company.v4employee
        `, {}, { context: context }, context.body.control);

        context.send(data);
    }
    catch (err) {
        context.send(api.nfError(err).json());
    }
}

export async function get(context) {
    const resp = await dbapi.query(`select * from company.v4employee where id = :employeeId
    `, { employeeId: context.body.args.employeeId }, { context: context });

    context.send({ data: resp.data[0] });
}

export async function create(context) {
    const resp = await dbapi.broker(`company.employee.add`, context.body.args, { context: context });

    context.send({ data: resp.data });
}

export async function update(context) {
    const resp = await dbapi.broker(`company.employee.upd`, context.body.args, { context: context });

    context.send({ data: resp.data });
}

export async function remove(context) {
    const resp = await dbapi.broker(`company.employee.del`, { id: context.body.args.id }, { context: context });

    context.send({ data: resp.data });
}

export async function save(context) {
    const connect = await dbapi.getConnect(context);
    const { employee, contacts } = context.body.args;
    let employeeId = employee.id;
    try {
        await connect.begin();

        if (!employeeId) {
            const resp = await connect.broker(`company.employee.add`, employee);
            employeeId = resp.data.id;
        } else {
            await connect.broker('company.employee.upd', employee);
        }

        for (let el of contacts?.add || []) {
            el.employee_id = employeeId;
            await connect.broker('company.employee_contact.add', el);
        }
        for (let el of contacts?.upd || []) {
            await connect.broker('company.employee_contact.upd', el);
        }
        for (let el of contacts?.del || []) {
            await connect.broker('company.employee_contact.del', el);
        }

        await connect.commit();
        context.send({ data: { id: employeeId } });
    } catch (error) {
        await connect.rollback();
        const err = api.nfError(error, error.message);
        context.send(err.json());
    }
    finally {
        if (connect) {
            connect.release();
        }
    }
}

export async function contactsList(context) {
    try {
        const data = await dbapi.query(`select * from company.v4employee_contact c where c.employee_id = :employeeId
        `, { employeeId: context.body.args.employeeId }, { context: context });

        context.send(data);
    }
    catch (err) {
        context.send(api.nfError(err).json());
    }
}
