/* Inserts a new series into the database */
CREATE OR REPLACE PROCEDURE 
insert_series(link VARCHAR (60), image BYTEA, synopsis VARCHAR (280), 
  title VARCHAR (60), release DATE, clasification VARCHAR (3), 
  length INT, running BOOLEAN)
AS $$
DECLARE
  id int;
BEGIN
  INSERT INTO entry (link, image, synopsis, title, release, clasification, type) 
    VALUES (link, image, synopsis, title, release, clasification, 's') 
    RETURNING id_entry INTO id;
  INSERT INTO movie VALUES (id, running);
END;
$$ LANGUAGE plpgsql;

