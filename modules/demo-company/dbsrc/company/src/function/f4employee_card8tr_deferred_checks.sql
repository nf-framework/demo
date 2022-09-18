CREATE OR REPLACE FUNCTION company.f4employee_card8tr_deferred_checks()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$begin
if TG_WHEN = 'AFTER' then
    if (TG_OP = 'INSERT') or 
       (TG_OP = 'UPDATE' and (old.date_begin is distinct from new.date_begin or
                              old.date_end is distinct from new.date_end)) then
        declare
            v_date_begin date;
            v_date_end date;
        begin
            select t.date_begin, t.date_end into v_date_begin, v_date_end 
              from company.employee_card_inoperability t where t.card_id = new.id and not daterange(new.date_begin, new.date_end, '[)') @> daterange(t.date_begin, t.date_end, '[)')
             limit 1;
            if v_date_begin is not null  then
                raise '%', nfc.f_msg8prepare(
                    'cardInoperabilityRangeMustBeIncardRange', 
                    'companyDataWarn', 
                    v_date_begin::text,
                    v_date_end::text,
                    new.date_begin::text,
                    new.date_end::text
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