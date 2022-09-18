create or replace view company.v4employee_card as 
 SELECT main.id,
    main.employee_id,
    main.date_begin,
    main.date_end,
    main."position",
    main.rate
   FROM company.employee_card main
     LEFT JOIN company.employee ref_employee_id ON ref_employee_id.id = main.employee_id
  WHERE nfc.f4role_unitprivs8check('company.employee_card'::character varying);