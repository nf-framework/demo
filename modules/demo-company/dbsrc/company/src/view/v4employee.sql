create or replace view company.v4employee as 
 SELECT main.id,
    main.firstname,
    main.lastname,
    main.patronymic,
    main.gender,
    main.birthdate
   FROM company.employee main
  WHERE nfc.f4role_unitprivs8check('company.employee'::character varying);