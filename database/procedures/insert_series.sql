/* Inserts a new series into the database */
CREATE OR REPLACE PROCEDURE 
insert_series(title VARCHAR (60), synopsis VARCHAR (280), image TEXT, 
	trailer TEXT, release INT, classification VARCHAR (3))
AS $$
DECLARE
  id int;
BEGIN
  INSERT INTO entry (title, synopsis, image, release, classification, type)
    VALUES (title, synopsis, image, release, classification, 's')
    RETURNING id_entry INTO id;
  INSERT INTO series VALUES (id, trailer);
END;
$$ LANGUAGE plpgsql;

