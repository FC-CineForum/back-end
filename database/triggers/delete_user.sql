/* Soft deletes users */
CREATE OR REPLACE FUNCTION
delete_user_fn()
RETURNS TRIGGER 
AS $$
BEGIN
  UPDATE users
  SET deleted = TRUE,
      biography = NULL,
      email = NULL,
      country = NULL,
      is_public = NULL,
      date_of_birth = NULL,
      avatar = NULL,
      password = NULL,
      name = NULL,
      last_name = NULL,
      token = NULL,
      is_verified = NULL
  WHERE username = OLD.username;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER delete_user
BEFORE DELETE
ON users
FOR EACH ROW
EXECUTE PROCEDURE delete_user_fn();
