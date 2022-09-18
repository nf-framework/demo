create or replace view company.v4employee_card_inoperability as 
 SELECT main.id,
    main.card_id,
    main.date_begin,
    main.date_end,
    main.type,
    main.other_type_description,
    main.file
   FROM company.employee_card_inoperability main
     JOIN company.employee_card ref_card_id ON ref_card_id.id = main.card_id
  WHERE nfc.f4role_unitprivs8check('company.employee_card_inoperability'::character varying);