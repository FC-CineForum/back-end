/* Sub1 to index for all rows of same type as OLD entry and higher index */
CREATE OR REPLACE FUNCTION 
delete_lie()
RETURNS TRIGGER
AS $$
DECLARE
  entry_limit INT := 5;
BEGIN
  -- Shift entries with bigger index than OLD by one
  UPDATE last_inserted_entry
  SET index = index - 1
  WHERE type = OLD.type
  AND index > OLD.index;
  
  -- Select entry with biggest id value as entry_limit-th last inserted entry
  INSERT INTO last_inserted_entry
  (id_entry, index, type)
  SELECT MAX(id_entry), entry_limit-1, OLD.type 
  FROM entry
  WHERE type = OLD.type
  AND entry.id_entry NOT IN (SELECT id_entry FROM last_inserted_entry);

  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER delete_last_inserted_entries
AFTER DELETE
ON last_inserted_entry
FOR EACH ROW
EXECUTE PROCEDURE delete_lie();