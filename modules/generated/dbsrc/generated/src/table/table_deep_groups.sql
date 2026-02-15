{
    "schema": "generated",
    "tablename": "table_deep_groups",
    "comment": null,
    "cols": [
        {
            "name": "id",
            "datatype": "int8",
            "datatype_length": null,
            "datatype_full": "bigint",
            "required": true,
            "default_value": "nextval('generated.s4table_deep_groups'::text::regclass)",
            "comment": null,
            "fk_tablename": null,
            "column_id": 1
        },
        {
            "name": "service",
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
            "name": "owner",
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
            "name": "jan_plan",
            "datatype": "int4",
            "datatype_length": null,
            "datatype_full": "integer",
            "required": true,
            "default_value": null,
            "comment": null,
            "fk_tablename": null,
            "column_id": 4
        },
        {
            "name": "jan_fact",
            "datatype": "int4",
            "datatype_length": null,
            "datatype_full": "integer",
            "required": true,
            "default_value": null,
            "comment": null,
            "fk_tablename": null,
            "column_id": 5
        },
        {
            "name": "feb_plan",
            "datatype": "int4",
            "datatype_length": null,
            "datatype_full": "integer",
            "required": true,
            "default_value": null,
            "comment": null,
            "fk_tablename": null,
            "column_id": 6
        },
        {
            "name": "feb_fact",
            "datatype": "int4",
            "datatype_length": null,
            "datatype_full": "integer",
            "required": true,
            "default_value": null,
            "comment": null,
            "fk_tablename": null,
            "column_id": 7
        },
        {
            "name": "apr_plan",
            "datatype": "int4",
            "datatype_length": null,
            "datatype_full": "integer",
            "required": true,
            "default_value": null,
            "comment": null,
            "fk_tablename": null,
            "column_id": 8
        },
        {
            "name": "apr_fact",
            "datatype": "int4",
            "datatype_length": null,
            "datatype_full": "integer",
            "required": true,
            "default_value": null,
            "comment": null,
            "fk_tablename": null,
            "column_id": 9
        },
        {
            "name": "may_plan",
            "datatype": "int4",
            "datatype_length": null,
            "datatype_full": "integer",
            "required": true,
            "default_value": null,
            "comment": null,
            "fk_tablename": null,
            "column_id": 10
        },
        {
            "name": "may_fact",
            "datatype": "int4",
            "datatype_length": null,
            "datatype_full": "integer",
            "required": true,
            "default_value": null,
            "comment": null,
            "fk_tablename": null,
            "column_id": 11
        },
        {
            "name": "inc_open",
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
            "name": "inc_closed",
            "datatype": "int4",
            "datatype_length": null,
            "datatype_full": "integer",
            "required": true,
            "default_value": null,
            "comment": null,
            "fk_tablename": null,
            "column_id": 13
        },
        {
            "name": "sla_hit_pct",
            "datatype": "int4",
            "datatype_length": null,
            "datatype_full": "integer",
            "required": true,
            "default_value": null,
            "comment": null,
            "fk_tablename": null,
            "column_id": 14
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
            "column_id": 15
        }
    ],
    "cons": [
        {
            "name": "table_deep_groups_pkey",
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
        }
    ],
    "indx": null
}
