{
    "schema": "company",
    "tablename": "employee_card_inoperability",
    "comment": "Временная нетрудоспособность сотрудника на позиции",
    "cols": [
        {
            "name": "card_id",
            "datatype": "int8",
            "datatype_length": null,
            "datatype_full": "bigint",
            "required": true,
            "default_value": null,
            "comment": null,
            "fk_tablename": "company.employee_card",
            "column_id": 2
        },
        {
            "name": "date_begin",
            "datatype": "date",
            "datatype_length": null,
            "datatype_full": "date",
            "required": true,
            "default_value": null,
            "comment": "Дата начала нетрудоспособности",
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
            "comment": "Дата окончания нетрудоспособности",
            "fk_tablename": null,
            "column_id": 4
        },
        {
            "name": "file",
            "datatype": "varchar",
            "datatype_length": null,
            "datatype_full": "character varying",
            "required": false,
            "default_value": null,
            "comment": null,
            "fk_tablename": null,
            "column_id": 8
        },
        {
            "name": "id",
            "datatype": "int8",
            "datatype_length": null,
            "datatype_full": "bigint",
            "required": true,
            "default_value": "nextval('company.s4employee_card_inoperability'::text::regclass)",
            "comment": null,
            "fk_tablename": null,
            "column_id": 1
        },
        {
            "name": "other_type_description",
            "datatype": "varchar",
            "datatype_length": null,
            "datatype_full": "character varying",
            "required": false,
            "default_value": null,
            "comment": null,
            "fk_tablename": null,
            "column_id": 6
        },
        {
            "name": "type",
            "datatype": "int4",
            "datatype_length": null,
            "datatype_full": "integer",
            "required": true,
            "default_value": null,
            "comment": "Тип нетрудоспособности",
            "fk_tablename": null,
            "column_id": 5
        }
    ],
    "cons": [
        {
            "name": "ch4employee_card_inoperability8dates",
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
            "name": "ch4employee_card_inoperability8other_type_description",
            "schema": "company",
            "type": "c",
            "update_rule": null,
            "delete_rule": null,
            "condition": "(((type = 2) AND (other_type_description IS NOT NULL)) OR ((type <> 2) AND (other_type_description IS NULL)))",
            "definition": "CHECK (type = 2 AND other_type_description IS NOT NULL OR type <> 2 AND other_type_description IS NULL)",
            "r_schema": null,
            "r_tablename": null,
            "r_columnname": null,
            "columns": "type,other_type_description",
            "comment": null,
            "deferrable": null
        },
        {
            "name": "ex4employee_card_inoperability8dates",
            "schema": "company",
            "type": "x",
            "update_rule": null,
            "delete_rule": null,
            "condition": null,
            "definition": "EXCLUDE USING gist (card_id WITH =, daterange(date_begin, date_end, '[)'::text) WITH &&) DEFERRABLE INITIALLY DEFERRED",
            "r_schema": null,
            "r_tablename": null,
            "r_columnname": null,
            "columns": "card_id",
            "comment": null,
            "deferrable": "deferred"
        },
        {
            "name": "fk4employee_card_inoperability8card_id",
            "schema": "company",
            "type": "f",
            "update_rule": "a",
            "delete_rule": "c",
            "condition": null,
            "definition": "FOREIGN KEY (card_id) REFERENCES company.employee_card(id) ON DELETE CASCADE",
            "r_schema": "company",
            "r_tablename": "employee_card",
            "r_columnname": "id",
            "columns": "card_id",
            "comment": null,
            "deferrable": null
        },
        {
            "name": "pk4employee_card_inoperability",
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
            "name": "i4employee_card_inoperability8card_id",
            "schema": "company",
            "columns": [
                {
                    "name": "card_id",
                    "nulls": "last",
                    "order": "asc",
                    "collate": null
                }
            ],
            "is_unique": false,
            "method": "btree",
            "tablespace": null,
            "definition": "CREATE INDEX i4employee_card_inoperability8card_id ON company.employee_card_inoperability USING btree (card_id)"
        }
    ]
}