CREATE TRIGGER tr4employee_card8checks_before BEFORE INSERT OR UPDATE ON company.employee_card FOR EACH ROW EXECUTE PROCEDURE company.f4employee_card8tr_checks();
