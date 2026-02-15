{
    "schema": "generated",
    "tablename": "table_inline_edit",
    "comment": null,
    "cols": [
        {
            "name": "id",
            "datatype": "int8",
            "datatype_length": null,
            "datatype_full": "bigint",
            "required": true,
            "default_value": "nextval('generated.s4table_inline_edit'::text::regclass)",
            "comment": null,
            "fk_tablename": null,
            "column_id": 1
        },
        {
            "name": "ticket",
            "datatype": "text",
            "datatype_length": null,
            "datatype_full": "text",
            "required": true,
            "default_value": null,
            "comment": null,
            "fk_tablename": null,
            "column_id": 2
        },
        {
            "name": "title",
            "datatype": "text",
            "datatype_length": null,
            "datatype_full": "text",
            "required": true,
            "default_value": null,
            "comment": null,
            "fk_tablename": null,
            "column_id": 3
        },
        {
            "name": "assignee",
            "datatype": "text",
            "datatype_length": null,
            "datatype_full": "text",
            "required": true,
            "default_value": null,
            "comment": null,
            "fk_tablename": null,
            "column_id": 4
        },
        {
            "name": "team",
            "datatype": "text",
            "datatype_length": null,
            "datatype_full": "text",
            "required": true,
            "default_value": null,
            "comment": null,
            "fk_tablename": null,
            "column_id": 5
        },
        {
            "name": "priority",
            "datatype": "text",
            "datatype_length": null,
            "datatype_full": "text",
            "required": true,
            "default_value": null,
            "comment": null,
            "fk_tablename": null,
            "column_id": 6
        },
        {
            "name": "status",
            "datatype": "text",
            "datatype_length": null,
            "datatype_full": "text",
            "required": true,
            "default_value": null,
            "comment": null,
            "fk_tablename": null,
            "column_id": 7
        },
        {
            "name": "start_at",
            "datatype": "timestamp",
            "datatype_length": null,
            "datatype_full": "timestamp without time zone",
            "required": true,
            "default_value": null,
            "comment": null,
            "fk_tablename": null,
            "column_id": 8
        },
        {
            "name": "due_date",
            "datatype": "date",
            "datatype_length": null,
            "datatype_full": "date",
            "required": true,
            "default_value": null,
            "comment": null,
            "fk_tablename": null,
            "column_id": 9
        },
        {
            "name": "meeting_time",
            "datatype": "text",
            "datatype_length": null,
            "datatype_full": "text",
            "required": true,
            "default_value": null,
            "comment": null,
            "fk_tablename": null,
            "column_id": 10
        },
        {
            "name": "estimate_hours",
            "datatype": "numeric",
            "datatype_length": "8,2",
            "datatype_full": "numeric(8,2)",
            "required": true,
            "default_value": null,
            "comment": null,
            "fk_tablename": null,
            "column_id": 11
        },
        {
            "name": "progress_pct",
            "datatype": "int4",
            "datatype_length": null,
            "datatype_full": "integer",
            "required": true,
            "default_value": null,
            "comment": null,
            "fk_tablename": null,
            "column_id": 12
        },
        {
            "name": "remote",
            "datatype": "bool",
            "datatype_length": null,
            "datatype_full": "boolean",
            "required": true,
            "default_value": null,
            "comment": null,
            "fk_tablename": null,
            "column_id": 13
        },
        {
            "name": "notes",
            "datatype": "text",
            "datatype_length": null,
            "datatype_full": "text",
            "required": true,
            "default_value": null,
            "comment": null,
            "fk_tablename": null,
            "column_id": 14
        }
    ],
    "cons": [
        {
            "name": "table_inline_edit_pkey",
            "schema": "generated",
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
            "name": "table_inline_edit_ticket_key",
            "schema": "generated",
            "type": "u",
            "update_rule": null,
            "delete_rule": null,
            "condition": null,
            "definition": "UNIQUE (ticket)",
            "r_schema": null,
            "r_tablename": null,
            "r_columnname": null,
            "columns": "ticket",
            "comment": null,
            "deferrable": null
        }
    ],
    "indx": null
}
