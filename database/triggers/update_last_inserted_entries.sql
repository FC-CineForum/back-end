/* Updates last_inserted_entry table every time a new entry is inserted into entry table */
CREATE OR REPLACE FUNCTION 
update_lie()
RETURNS TRIGGER
AS $$
DECLARE
  entry_limit INT := 5; -- Max # of entries in last_inserted_entry per type
BEGIN
  -- Add 1 to index for all rows of same type as NEW entry
  UPDATE last_inserted_entry
  SET index = index + 1
  WHERE type = NEW.type;

  -- Delete (if exists) entry that exceeds entry_limit so
  -- that there's always at most entry_limit entries per type.
  DELETE FROM last_inserted_entry
  WHERE index >= entry_limit
  AND type = NEW.type;

  -- Add most recent entry at index 0
  INSERT INTO last_inserted_entry (id_entry, index, type)
  VALUES (NEW.id_entry, 0, NEW.type);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_last_inserted_entries
AFTER INSERT
ON entry
FOR EACH ROW
EXECUTE PROCEDURE update_lie();
