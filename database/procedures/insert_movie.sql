/* Inserts a new movie into the database */
CREATE OR REPLACE PROCEDURE 
insert_movie(title VARCHAR (60), synopsis VARCHAR (280), image TEXT, 
	trailer TEXT, release INT, classification VARCHAR (3), length INT)
AS $$
DECLARE
  id int;
BEGIN
  INSERT INTO entry (title, synopsis, image, release, classification, type)
    VALUES (title, synopsis, image, release, classification, 'm')
	  RETURNING id_entry INTO id;
  INSERT INTO movie VALUES (id, trailer, length);
END;
$$ LANGUAGE plpgsql;