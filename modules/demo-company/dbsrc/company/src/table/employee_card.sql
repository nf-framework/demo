{
    "schema": "company",
    "tablename": "employee_card",
    "comment": "Личное дело сотрудника",
    "cols": [
        {
            "name": "date_begin",
            "datatype": "date",
            "datatype_length": null,
            "datatype_full": "date",
            "required": true,
            "default_value": null,
            "comment": "Дата начала работы",
            "fk_tablename": null,
            "column_id": 3
        },
        {
            "name": "date_end",
            "datatype": "date",
            "datatype_length": null,
            "datatype_full": "date",
            "required": false,
            "default_value": null,
            "comment": "Дата окончания работы",
            "fk_tablename": null,
            "column_id": 4
        },
        {
            "name": "employee_id",
            "datatype": "int8",
            "datatype_length": null,
            "datatype_full": "bigint",
            "required": false,
            "default_value": null,
            "comment": null,
            "fk_tablename": "company.employee",
            "column_id": 2
        },
        {
            "name": "id",
            "datatype": "int8",
            "datatype_length": null,
            "datatype_full": "bigint",
            "required": true,
            "default_value": "nextval('company.s4employee_card'::text::regclass)",
            "comment": null,
            "fk_tablename": null,
            "column_id": 1
        },
        {
            "name": "position",
            "datatype": "int4",
            "datatype_length": null,
            "datatype_full": "integer",
            "required": true,
            "default_value": null,
            "comment": "Должность",
            "fk_tablename": null,
            "column_id": 5
        },
        {
            "name": "rate",
            "datatype": "numeric",
            "datatype_length": "2,1",
            "datatype_full": "numeric(2,1)",
            "required": true,
            "default_value": "1.0",
            "comment": "Ставка",
            "fk_tablename": null,
            "column_id": 6
        }
    ],
    "cons": [
        {
            "name": "ch4employee_card8dates",
            "schema": "company",
            "type": "c",
            "update_rule": null,
            "delete_rule": null,
            "condition": "(date_begin <= date_end)",
            "definition": "CHECK (date_begin <= date_end)",
            "r_schema": null,
            "r_tablename": null,
            "r_columnname": null,
            "columns": "date_begin,date_end",
            "comment": null,
            "deferrable": null
        },
        {
            "name": "fk4employee_card8employee_id",
            "schema": "company",
            "type": "f",
            "update_rule": "a",
            "delete_rule": "a",
            "condition": null,
            "definition": "FOREIGN KEY (employee_id) REFERENCES company.employee(id)",
            "r_schema": "company",
            "r_tablename": "employee",
            "r_columnname": "id",
            "columns": "employee_id",
            "comment": null,
            "deferrable": null
        },
        {
            "name": "pk4employee_card",
            "schema": "company",
            "type": "p",
            "update_rule": null,
            "delete_rule": null,
            "condition": null,
            "definition": "PRIMARY KEY (id)",
            "r_schema": null,
            "r_tablename": null,
            "r_columnname": null,
            "columns": "id",
            "comment": null,
            "deferrable": null
        }
    ],
    "indx": [
        {
            "name": "i4employee_card8employee_id",
            "schema": "company",
            "columns": [
                {
                    "name": "employee_id",
                    "nulls": "last",
                    "order": "asc",
                    "collate": null
                }
            ],
            "is_unique": false,
            "method": "btree",
            "tablespace": null,
            "definition": "CREATE INDEX i4employee_card8employee_id ON company.employee_card USING btree (employee_id)"
        },
        {
            "name": "uk4employee_card8actual_postion",
            "schema": "company",
            "columns": [
                {
                    "name": "employee_id",
                    "nulls": "last",
                    "order": "asc",
                    "collate": null
                }
            ],
            "is_unique": true,
            "method": "btree",
            "tablespace": null,
            "definition": "CREATE UNIQUE INDEX uk4employee_card8actual_postion ON company.employee_card USING btree (employee_id) WHERE date_end IS NULL"
        }
    ]
}