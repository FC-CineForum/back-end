/* Removes unnecessary info of deleted user from other tables */
CREATE OR REPLACE FUNCTION
delete_user_info_fn()
RETURNS TRIGGER
AS $$
BEGIN
  DELETE FROM playlist
  WHERE username = NEW.username;

  DELETE FROM administrator
  WHERE username = NEW.username;

  DELETE FROM follow_user
  WHERE username_follower = NEW.username
    OR username_following = NEW.username;

  DELETE FROM follow_celebrity
  WHERE username = NEW.username;

  DELETE FROM report_user
  WHERE username_reporter = NEW.username
    OR username_reportee = NEW.username;
    
  DELETE FROM report_reply
  WHERE username = NEW.username;

  DELETE FROM report_rating
  WHERE username = NEW.username;

  DELETE FROM likes
  WHERE username = NEW.username;

  RETURN NEW;
END; 
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER delete_user_info
AFTER UPDATE
ON users
FOR EACH ROW
WHEN (NEW.deleted = TRUE)
EXECUTE PROCEDURE delete_user_info_fn();
