{
    "schema": "company",
    "tablename": "employee",
    "comment": "Сотрудники",
    "cols": [
        {
            "name": "birthdate",
            "datatype": "date",
            "datatype_length": null,
            "datatype_full": "date",
            "required": true,
            "default_value": null,
            "comment": "Дата рождения",
            "fk_tablename": null,
            "column_id": 6
        },
        {
            "name": "firstname",
            "datatype": "varchar",
            "datatype_length": null,
            "datatype_full": "character varying",
            "required": true,
            "default_value": null,
            "comment": "Имя",
            "fk_tablename": null,
            "column_id": 2
        },
        {
            "name": "gender",
            "datatype": "int4",
            "datatype_length": null,
            "datatype_full": "integer",
            "required": true,
            "default_value": null,
            "comment": "Пол",
            "fk_tablename": null,
            "column_id": 5
        },
        {
            "name": "id",
            "datatype": "int8",
            "datatype_length": null,
            "datatype_full": "bigint",
            "required": true,
            "default_value": "nextval('company.s4employee'::text::regclass)",
            "comment": "Идентификатор",
            "fk_tablename": null,
            "column_id": 1
        },
        {
            "name": "lastname",
            "datatype": "varchar",
            "datatype_length": null,
            "datatype_full": "character varying",
            "required": true,
            "default_value": null,
            "comment": "Фамилия",
            "fk_tablename": null,
            "column_id": 3
        },
        {
            "name": "patronymic",
            "datatype": "varchar",
            "datatype_length": null,
            "datatype_full": "character varying",
            "required": false,
            "default_value": null,
            "comment": "Отчество",
            "fk_tablename": null,
            "column_id": 4
        }
    ],
    "cons": [
        {
            "name": "pk4employee",
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
    "indx": null
}