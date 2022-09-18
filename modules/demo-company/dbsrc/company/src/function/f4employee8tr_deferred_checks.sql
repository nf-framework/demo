CREATE OR REPLACE FUNCTION company.f4employee8tr_deferred_checks()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$begin
if TG_WHEN = 'AFTER' then
    if (TG_OP = 'INSERT') or 
       (TG_OP = 'UPDATE' and (old.birthdate is distinct from new.birthdate)) then
        declare 
            v_date_begin date;
        begin
            select t.date_begin into v_date_begin from company.employee_card t where t.employee_id = new.id and t.date_begin < new.birthdate limit 1;
            if v_date_begin is not null then
                raise '%', nfc.f_msg8prepare('cardDateBeginMustBeGreaterBirthDate', 'companyDataWarn', v_date_begin::text);
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