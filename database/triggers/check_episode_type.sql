/* Verifies that entry.type equals 'e' for rows in episode */
CREATE OR REPLACE FUNCTION 
check_ep_type()
RETURNS TRIGGER
AS $$
DECLARE
  entry_type CHAR (1);
BEGIN
  SELECT type INTO entry_type FROM entry WHERE id_entry = NEW.id_episode;
  IF entry_type <> 'e' THEN
    RAISE EXCEPTION 'Entry type does not match episode type "e"';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER check_episode_type
BEFORE INSERT OR UPDATE
ON episode
FOR EACH ROW
EXECUTE PROCEDURE check_ep_type();