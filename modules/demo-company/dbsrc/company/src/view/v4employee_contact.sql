create or replace view company.v4employee_contact as 
 SELECT main.id,
    main.employee_id,
    main.contact_type,
    main.contact
   FROM company.employee_contact main
     JOIN company.employee ref_employee_id ON ref_employee_id.id = main.employee_id
  WHERE nfc.f4role_unitprivs8check('company.employee_contact'::character varying);