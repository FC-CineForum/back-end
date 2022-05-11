/* Inserts a new movie into the database */
CREATE OR REPLACE PROCEDURE 
insert_movie(link VARCHAR (60), image BYTEA, synopsis VARCHAR (280), 
  title VARCHAR (60), release DATE, clasification VARCHAR (3), length INT)
AS $$
DECLARE
  id int;
BEGIN
  INSERT INTO entry (link, image, synopsis, title, release, clasification, type)
    VALUES (link, image, synopsis, title, release, clasification, 'm')
	  RETURNING id_entry INTO id;
  INSERT INTO movie VALUES (id, length);
END;
$$ LANGUAGE plpgsql;

