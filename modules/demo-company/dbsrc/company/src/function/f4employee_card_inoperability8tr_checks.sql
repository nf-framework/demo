CREATE OR REPLACE FUNCTION company.f4employee_card_inoperability8tr_checks()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$begin
if TG_WHEN = 'BEFORE' then
    if (TG_OP = 'INSERT') or 
       (TG_OP = 'UPDATE' and (old.date_begin is distinct from new.date_begin or
                              old.date_end is distinct from new.date_end)) then
        declare
            v_date_begin date;
            v_date_end date;
        begin
            select t.date_begin, t.date_end into v_date_begin, v_date_end from company.employee_card t where t.id = new.card_id;
            if not daterange(new.date_begin, new.date_end, '[)') <@ daterange(v_date_begin, v_date_end, '[)') then
                raise '%', nfc.f_msg8prepare(
                    'cardInoperabilityRangeMustBeIncardRange', 
                    'companyDataWarn', 
                    new.date_begin::text,
                    new.date_end::text,
                    v_date_begin::text,
                    v_date_end::text
                ); 
            end if;
        end;
    end if;
end if;
-- корректный возврат
if TG_WHEN = 'BEFORE' then 
    if TG_OP in ('INSERT','UPDATE') then 
        return NEW;
    elsif TG_OP = 'DELETE' then 
        return OLD;
    end if;
else 
    return null;
end if;   
end;$function$
;