CREATE OR REPLACE FUNCTION
last_modif_date()
RETURNS TRIGGER
AS $$
BEGIN
  UPDATE playlist
  SET date_modified = CURRENT_DATE
  WHERE username = NEW.username
  AND list_name = NEW.list_name;
  
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_date_playlist
AFTER INSERT
ON playlist_entry
FOR EACH ROW
EXECUTE PROCEDURE last_modif_date();
