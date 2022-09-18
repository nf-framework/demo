CREATE OR REPLACE FUNCTION company.f4employee_card8tr_checks()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$begin
if TG_WHEN = 'BEFORE' then
    if (TG_OP = 'INSERT') or 
       (TG_OP = 'UPDATE' and (old.date_begin is distinct from new.date_begin)) then
        if (new.date_begin < (select k.birthdate from company.employee k where k.id = new.employee_id)) then
            raise '%', nfc.f_msg8prepare('cardDateBeginMustBeGreaterBirthDate', 'companyDataWarn', new.date_begin::text);
        end if;
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