{
    "schema": "company",
    "tablename": "employee_contact",
    "comment": "Контакт сотрудника",
    "cols": [
        {
            "name": "contact",
            "datatype": "varchar",
            "datatype_length": null,
            "datatype_full": "character varying",
            "required": true,
            "default_value": null,
            "comment": "Контакт",
            "fk_tablename": null,
            "column_id": 4
        },
        {
            "name": "contact_type",
            "datatype": "int4",
            "datatype_length": null,
            "datatype_full": "integer",
            "required": true,
            "default_value": null,
            "comment": "Тип контакта",
            "fk_tablename": null,
            "column_id": 3
        },
        {
            "name": "employee_id",
            "datatype": "int8",
            "datatype_length": null,
            "datatype_full": "bigint",
            "required": true,
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
            "default_value": "nextval('company.s4employee_contact'::text::regclass)",
            "comment": null,
            "fk_tablename": null,
            "column_id": 1
        }
    ],
    "cons": [
        {
            "name": "fk4employee_contact8employee_id",
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
            "name": "pk4employee_contact",
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
        },
        {
            "name": "uk4employee_contact",
            "schema": "company",
            "type": "u",
            "update_rule": null,
            "delete_rule": null,
            "condition": null,
            "definition": "UNIQUE (employee_id, contact_type, contact)",
            "r_schema": null,
            "r_tablename": null,
            "r_columnname": null,
            "columns": "employee_id,contact_type,contact",
            "comment": null,
            "deferrable": null
        }
    ],
    "indx": [
        {
            "name": "i4employee_contact8employee_id",
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
            "definition": "CREATE INDEX i4employee_contact8employee_id ON company.employee_contact USING btree (employee_id)"
        }
    ]
}