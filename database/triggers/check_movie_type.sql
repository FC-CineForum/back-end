/* Verifies that entry.type equals 'm' for rows in movie */
CREATE OR REPLACE FUNCTION 
check_mv_type()
RETURNS TRIGGER
AS $$
DECLARE
  entry_type CHAR (1);
BEGIN
  SELECT type INTO entry_type FROM entry WHERE id_entry = NEW.id_episode;
  IF entry_type <> 'm' THEN
    RAISE EXCEPTION 'Entry type does not match movie type "m"';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER check_movie_type
BEFORE INSERT OR UPDATE
ON movie
FOR EACH ROW
EXECUTE PROCEDURE check_mv_type();

