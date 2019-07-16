<?php

require_once 'c_db.php';

class calendar
{

	private $calendar_json;
	private $database;

	function __construct(){
		
		$this->database = new Database();
	
	}

	# This function inserts or updates a calendar
	public function create($calendar_name, $dynamic_data, $static_data){

		# Create a hash for the url of the calendar based on the name, JSON data, and the logged in user.
		$calendar_hash = md5($calendar_name.$dynamic_data.$static_data.$_SESSION['user_id'].date("D M d, Y G:i"));

		$sql = 'INSERT INTO calendars_beta( user_id, name, dynamic_data, static_data, hash ) VALUES ( :user_id, :calendar_name, :dynamic_data, :static_data, :calendar_hash )';

		# Send the query
		$this->database->query($sql);
		
		# Bind the parameters to the query
		$this->database->bind(':user_id', $_SESSION['user_id']);
		$this->database->bind(':calendar_name', $calendar_name);
		$this->database->bind(':dynamic_data', $dynamic_data);
		$this->database->bind(':static_data', $static_data);
		$this->database->bind(':calendar_hash', $calendar_hash);

		# Return the last inserted ID
		if($this->database->execute())
		{
			return array("success" => true, "hash" => $calendar_hash);
		}
		else
		{
			return array("success" => false, "error" => "Error - Unable to create calendar. Please try again in a moment.");
		}
	}

	# This function inserts or updates a calendar
	public function duplicate($calendar_hash){

		# Create a hash for the url of the calendar based on the previous hash
		$new_hash = md5($calendar_hash.time());

		$sql = 'INSERT INTO calendars_beta( user_id, name, data, hash )
				SELECT user_id, CONCAT(name, " Copy"), data, :new_hash
				FROM calendars_beta
				WHERE hash = :calendar_hash
					AND (user_id = :user_id OR :permission = "Admin")';

		# Send the query
		$this->database->query($sql);
		
		# Bind the parameters to the query
		$this->database->bind(':new_hash', $new_hash);
		$this->database->bind(':calendar_hash', $calendar_hash);
		$this->database->bind(':user_id', $_SESSION['user_id']);
		$this->database->bind(':permission', $_SESSION['permission']);

		# Return the last inserted ID
		if($this->database->execute())
		{
			return array("success" => true, "data" => $new_hash);
		}
		else
		{
			return array("success" => false, "error" => "Error - Unable to duplicate calendar. Please try again in a moment.");
		}
	}

	# This function inserts or updates a calendar
	public function update_name($calendar_hash, $name){

		# Get the current date time
		$last_changed = date('Y-m-d H:i:s');

		$sql = 'UPDATE calendars_beta
				SET name = :name,
					last_static_change = :last_static_change
				WHERE hash = :calendar_hash
					AND (user_id = :user_id OR :permission = "Admin")';

		# Send the query
		$this->database->query($sql);

		$this->database->bind(':calendar_hash', $calendar_hash);
		$this->database->bind(':name', $name);
		$this->database->bind(':last_static_change', $last_changed);
		$this->database->bind(':user_id', $_SESSION['user_id']);
		$this->database->bind(':permission', $_SESSION['permission']);

		# Return boolean of success or failure
		if($this->database->execute())
		{
			return array("success" => true, "data" => true);
		}
		else
		{
			return array("success" => false, "error" => "Error - Unable to update calendar. Please try again in a moment.");
		}

	}

	# This function inserts or updates a calendar
	public function update_all($calendar_hash, $dynamic_data, $static_data){
		
		# Get the current date time
		$last_changed = date('Y-m-d H:i:s');

		$sql = 'UPDATE calendars_beta
				SET dynamic_data = :dynamic_data,
					static_data = :static_data,
					last_dynamic_change = :last_dynamic_change,
					last_static_change = :last_static_change
				WHERE hash = :calendar_hash
					AND (user_id = :user_id OR :permission = "Admin")';

		# Send the query
		$this->database->query($sql);

		$this->database->bind(':calendar_hash', $calendar_hash);
		$this->database->bind(':dynamic_data', $dynamic_data);
		$this->database->bind(':static_data', $static_data);
		$this->database->bind(':last_dynamic_change', $last_changed);
		$this->database->bind(':last_static_change', $last_changed);
		$this->database->bind(':user_id', $_SESSION['user_id']);
		$this->database->bind(':permission', $_SESSION['permission']);

		# Return boolean of success or failure
		if($this->database->execute())
		{
			return array("success" => true, "data" => true);
		}
		else
		{
			return array("success" => false, "error" => "Error - Unable to update calendar. Please try again in a moment.");
		}

	}

	# This function inserts or updates a calendar
	public function update_dynamic($calendar_hash, $dynamic_data){

		# Get the current date time
		$last_changed = date('Y-m-d H:i:s');

		$sql = 'UPDATE calendars_beta
				SET dynamic_data = :dynamic_data,
					last_dynamic_change = :last_dynamic_change
				WHERE hash = :calendar_hash
					AND (user_id = :user_id OR :permission = "Admin")';

		# Send the query
		$this->database->query($sql);

		$this->database->bind(':calendar_hash', $calendar_hash);
		$this->database->bind(':dynamic_data', $dynamic_data);
		$this->database->bind(':last_dynamic_change', $last_changed);
		$this->database->bind(':user_id', $_SESSION['user_id']);
		$this->database->bind(':permission', $_SESSION['permission']);

		# Return boolean of success or failure
		return $this->database->execute();

		if($this->database->execute())
		{
			return array("success" => true, "data" => true);
		}
		else
		{
			return array("success" => false, "error" => "Error - Unable to update calendar. Please try again in a moment.");
		}

	}

	# This function inserts or updates a calendar
	public function update_children_hashes($hash, $children){
		
		# Get the current date time
		$last_changed = date('Y-m-d H:i:s');

		$sql = 'UPDATE calendars_beta
				SET children = :children
				WHERE hash = :hash
					AND (user_id = :user_id OR :permission = "Admin")';

		# Send the query
		$this->database->query($sql);

		$this->database->bind(':hash', $hash);
		$this->database->bind(':children', $children);
		$this->database->bind(':user_id', $_SESSION['user_id']);
		$this->database->bind(':permission', $_SESSION['permission']);

		# Return boolean of success or failure
		if($this->database->execute())
		{
			return array("success" => true, "data" => true);
		}
		else
		{
			return array("success" => false, "error" => "Error - Unable to update calendar. Please try again in a moment.");
		}

	}

	# This function inserts or updates a calendar
	public function update_master_hash($hash, $master_hash){
		
		# Get the current date time
		$last_changed = date('Y-m-d H:i:s');

		$sql = 'UPDATE calendars_beta
				SET master_hash = :master_hash
				WHERE hash = :hash
					AND (user_id = :user_id OR :permission = "Admin")';

		# Send the query
		$this->database->query($sql);

		$this->database->bind(':hash', $hash);
		$this->database->bind(':master_hash', $master_hash);
		$this->database->bind(':user_id', $_SESSION['user_id']);
		$this->database->bind(':permission', $_SESSION['permission']);

		# Return boolean of success or failure
		if($this->database->execute())
		{
			return array("success" => true, "data" => true);
		}
		else
		{
			return array("success" => false, "error" => "Error - Unable to update calendar. Please try again in a moment.");
		}

	}

	# This function inserts or updates a calendar
	public function remove_master_hash($hash){
		
		# Get the current date time
		$last_changed = date('Y-m-d H:i:s');

		$sql = 'UPDATE calendars_beta
				SET master_hash = :master_hash
				WHERE hash = :hash
					AND (user_id = :user_id OR :permission = "Admin")';

		# Send the query
		$this->database->query($sql);

		$this->database->bind(':hash', $hash);
		$this->database->bind(':master_hash', '');
		$this->database->bind(':user_id', $_SESSION['user_id']);
		$this->database->bind(':permission', $_SESSION['permission']);

		# Return boolean of success or failure
		if($this->database->execute())
		{
			return array("success" => true, "data" => true);
		}
		else
		{
			return array("success" => false, "error" => "Error - Unable to update calendar. Please try again in a moment.");
		}

	}

	# This function returns a list of calendars_beta owned by the currently signed in user
	public function list_calendars(){
		# Prepare the query
		$sql = 'SELECT u.username, c.name, c.hash, c.children, c.master_hash
				FROM calendars_beta c
					JOIN users u
						ON c.user_id = u.id
				WHERE c.deleted = 0
					AND (user_id = :user_id OR :permission = "Admin")
				ORDER BY c.user_id, c.id';

		# Send the query
		$this->database->query($sql);

		# Bind the parameters
		$this->database->bind(':user_id', $_SESSION['user_id']);
		$this->database->bind(':user_id', $_SESSION['user_id']);
		$this->database->bind(':permission', $_SESSION['permission']);

		# Return the set of data
		return $this->database->resultset();
			
	}

	# This gets the calendar data from one calendar ID
	public function check_ownership($calendar_hash){

		# Prepare the query
		$sql = 'SELECT	c.name as calendar_name,
						u.username as username,
						IF(u.id = :user_id, "true", "false") as owner
				FROM calendars_beta c
					JOIN users u
						on c.user_id = u.id
				WHERE c.hash = :calendar_hash AND c.deleted = 0';

		# Send the query
		$this->database->query($sql);

		$user_id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;
		$permission = isset($_SESSION['permission']) ? $_SESSION['permission'] : null;

		# Bind the parameters
		$this->database->bind(':calendar_hash', $calendar_hash);
		$this->database->bind(':user_id', $user_id);

		# Return the single database in an associative array
		return $this->database->single();
	}

	# This gets the calendar data from one calendar ID
	public function get_dynamic_data($calendar_hash){

		# Prepare the query
		$sql = 'SELECT c.dynamic_data
				FROM calendars_beta c
				WHERE c.hash = :calendar_hash AND c.deleted = 0';

		# Send the query
		$this->database->query($sql);

		# Bind the parameters
		$this->database->bind(':calendar_hash', $calendar_hash);

		# Return the single database in an associative array
		return $this->database->single();

	}

	# This gets the calendar data from one calendar ID
	public function get_all_data($calendar_hash){

		# Prepare the query
		$sql = 'SELECT	c.name as calendar_name,
						c.dynamic_data,
						c.static_data,
						c.children,
						c.master_hash,
						c.last_static_change,
						c.last_dynamic_change
				FROM calendars_beta c
				WHERE c.hash = :calendar_hash AND c.deleted = 0';

		# Send the query
		$this->database->query($sql);

		# Bind the parameters
		$this->database->bind(':calendar_hash', $calendar_hash);

		# Return the single database in an associative array
		return $this->database->single();
	}

	# This function returns a list of calendars_beta owned by the currently signed in user
	public function list_children_calendars($master_hash){

		# Prepare the query
		$sql = 'SELECT	c.name as calendar_name,
						c.hash,
						c.static_data,
						c.dynamic_data,
						c.last_static_change,
						c.last_dynamic_change
				FROM calendars_beta c
				WHERE c.master_hash = :master_hash AND c.deleted = 0
					AND (user_id = :user_id OR :permission = "Admin")';

		# Send the query
		$this->database->query($sql);

		# Bind the parameters
		$this->database->bind(':master_hash', $master_hash);
		$this->database->bind(':user_id', $_SESSION['user_id']);
		$this->database->bind(':permission', $_SESSION['permission']);

		# Return the single database in an associative array
		return $this->database->resultset();
			
	}


	# This gets the last edited date from one calendar ID
	public function check_last_change($calendar_hash){

		# Prepare the query
		$sql = 'SELECT c.last_dynamic_change, c.last_static_change
				FROM calendars_beta c
				WHERE c.hash = :calendar_hash AND c.deleted = 0';

		# Send the query
		$this->database->query($sql);

		# Bind the parameters
		$this->database->bind(':calendar_hash', $calendar_hash);

		# Return the single database in an associative array
		return $this->database->single();

	}

	# This function deletes a calendar by the supplied ID
	# Require user's password? Perhaps store it somewhere anyway, just in case?
	public function delete($calendar_hash){

		$children = $this->list_children_calendars($calendar_hash);

		if(!empty($children)){

			foreach($children as $hash){

				$this->update_master_hash($hash, '');

			}

		}

		# Prepare the query
		$sql = 'UPDATE calendars_beta
				SET deleted = 1
				WHERE hash = :calendar_hash
					AND (user_id = :user_id OR :permission = "Admin")';

		# Send the query
		$this->database->query($sql);

		# Bind the parameters
		$this->database->bind(':calendar_hash', $calendar_hash);
		$this->database->bind(':user_id', $_SESSION['user_id']);


		# Execute the command, return success or failure
		return $this->database->execute();

	}
    
}

?>
