/* Sub1 to index for all rows of same type as OLD entry and higher index */
CREATE OR REPLACE FUNCTION 
delete_lie()
RETURNS TRIGGER
AS $$
DECLARE
  entry_limit INT := 5;
  entry_id INT;
  i INT := -1;
BEGIN
  SELECT index INTO i
  FROM last_inserted_entry 
  WHERE id_entry = OLD.id_entry;
  
  IF i = -1
  THEN RETURN OLD;
  END IF;
  
  -- Shift entries with bigger index than OLD by one
  UPDATE last_inserted_entry
  SET index = index - 1
  WHERE type = OLD.type
  AND index > i;
  
  SELECT MAX(id_entry) max_val
  INTO entry_id
  FROM entry
  WHERE type = OLD.type
  AND entry.id_entry 
      NOT IN (SELECT id_entry 
              FROM last_inserted_entry);
  
  -- Select entry with biggest id value as entry_limit-th last inserted entry
  IF entry_id IS NOT NULL
  THEN
    INSERT INTO last_inserted_entry 
    (id_entry, index, type) 
    SELECT entry_id, MAX(index)+1, OLD.type
    FROM last_inserted_entry
    WHERE type = OLD.type;
  END IF;

  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER delete_last_inserted_entries
AFTER DELETE
ON entry
FOR EACH ROW
EXECUTE PROCEDURE delete_lie();
