/* Verifies that entry.type equals 's' for rows in series */
CREATE OR REPLACE FUNCTION 
check_se_type()
RETURNS TRIGGER
AS $$
DECLARE
  entry_type CHAR (1);
BEGIN
  SELECT type INTO entry_type FROM entry WHERE id_entry = NEW.id_series;
  IF entry_type <> 's' THEN
    RAISE EXCEPTION 'Entry type does not match series type "s"';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER check_series
BEFORE INSERT OR UPDATE
ON series
FOR EACH ROW
EXECUTE PROCEDURE check_se_type();