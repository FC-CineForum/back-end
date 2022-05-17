/* Inserts a new episode into the database */
CREATE OR REPLACE PROCEDURE 
insert_episode(title VARCHAR (60), synopsis VARCHAR (280), image TEXT, 
	release DATE, classification VARCHAR (3), id_series INT, season INT, no_ep INT, length INT)
AS $$
DECLARE
  id int;
BEGIN
  INSERT INTO entry (title, synopsis, image, release, classification, type)
    VALUES (title, synopsis, image, release, classification, 'e')
    RETURNING id_entry INTO id;
  INSERT INTO episode VALUES (id, id_series, season, no_ep, length);
END;
$$ LANGUAGE plpgsql;

