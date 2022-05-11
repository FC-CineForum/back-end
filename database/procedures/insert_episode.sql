/* Inserts a new episode into the database */
CREATE OR REPLACE PROCEDURE 
insert_episode(link VARCHAR (60), image BYTEA, synopsis VARCHAR (280), 
  title VARCHAR (60), release DATE, clasification VARCHAR (3), 
  id_series INT, season INT, no_ep INT, length INT)
AS $$
DECLARE
  id int;
BEGIN
  INSERT INTO entry (link, image, synopsis, title, release, clasification, type) 
    VALUES (link, image, synopsis, title, release, clasification, 'e') 
    RETURNING id_entry INTO id;
  INSERT INTO movie VALUES (id, id_series, season, no_ep, length);
END;
$$ LANGUAGE plpgsql;

