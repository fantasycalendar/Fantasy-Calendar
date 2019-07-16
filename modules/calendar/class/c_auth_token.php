<?php

class auth_token
{
	
	private $database;
	
	public function __construct($database)
	{
		$this->database = $database;
	}
	
	#Returns database ID of authentication token, and its token from the database
	private function find()
	{
		
		if(!empty($_COOKIE['betafantasycalendar_remember']))
		{
			
			#Split the cookie's data into the selector and the authenticator
			list($id, $selector, $authenticator) = explode(':', $_COOKIE['betafantasycalendar_remember']);
			
			#Select all the data from the database with the selector
			$sql = 	"SELECT id, token
					 FROM auth_tokens
					 WHERE selector = :selector
					 LIMIT 1";
			
			
			$this->database->query($sql);
			
			$this->database->bind(':selector', $selector);
			
			return $this->database->single();
		
		}
		
	}
	
	public function remove()
	{
		
		$auth_token = $this->find();
				
		#then, check if the token from the database matches the hashed authenticator
		if(!empty($auth_token))
		{
			#And delete the authentication token because it's invalid
			$sql = 	"DELETE FROM auth_tokens
					WHERE id = :id";
			
			$this->database->query($sql);
			
			$this->database->bind(':id', $auth_token['id']);
			
			return $this->database->execute();
		
		}
		
	}
	
	public function removeAllByUserID($user_id)
	{
		
		#Bind the parameters
		$params = array(':user_id' => $user_id);
		
		#And delete the authentication token because we're giving out a new one
		$sql = 	"DELETE FROM auth_tokens
				WHERE user_id = :user_id";
			
		$this->database->query($sql);
		
		$this->database->bind(':user_id', $user_id);
		
		return $this->database->execute();
		
	}
	
	#This function creates an authorization token for the current device via cookies
	# !!!!!!! REMEMBER TO CLEAR UNUSED TOKENS EVERY MONTH OR SO !!!!!!!
	public function create($user_id)
	{
		
		#Find the authentication token's ID
		$auth_token = $this->find();
		
		#If the user has a token
		if(!empty($auth_token) && !empty($_COOKIE['betafantasycalendar_remember']))
		{
			
			#Get the selector from the cookie
			$selector = explode(':', $_COOKIE['betafantasycalendar_remember'])[1];
			
			#Create a new authenticator for the user
			$authenticator = random_bytes(33);
			
			#And hash it for the database
			$hash = hash("sha256", $authenticator);
			
			#Set the expiry time
			$expiryTime = time()+60*60*24*30;
			
			#Make it expire in a month
			$date = date('Y-m-d H:i:s', $expiryTime);

			#Bind the parameters
			$params = array( ':token_id' => $auth_token['id'], ':token' => $hash, ':expires' => $date );
			
			#Prepare the SQL query
			$sql = "UPDATE auth_tokens
					SET token = :token,
						expires = :expires
					WHERE id = :token_id";
			
			$this->database->query($sql);
			
			$this->database->bind(':token_id', $auth_token['id']);
			$this->database->bind(':token', $hash);
			$this->database->bind(':expires', $date);
		
		}
		#If there's no cookie containing the relevant information
		else
		{
			
			#Create a random selector for the user & the database
			$selector = base64_encode(random_bytes(9));
			
			#Create an authenticator for the user
			$authenticator = random_bytes(33);
			
			#And hash it for the database
			$hash = hash("sha256", $authenticator);
			
			#Set the expiry time
			$expiryTime = time()+60*60*24*30;
			
			#Make it expire in a month
			$date = date('Y-m-d H:i:s', $expiryTime);

			#Bind the parameters
			$params = array( ':selector' => $selector, ':token' => $hash, ':user_id' => $user_id, ':expires' => $date );
			
			#Prepare the SQL query
			$sql = "INSERT INTO auth_tokens ( user_id, selector, token, expires ) VALUES ( :user_id, :selector, :token, :expires  )";
				
			$this->database->query($sql);
		
			$this->database->bind(':selector', $selector);
			$this->database->bind(':token', $hash);
			$this->database->bind(':user_id', $user_id);
			$this->database->bind(':expires', $date);
			
		}
		
		$this->database->execute();
		
		#Update the cookie containing the relevant information
		setcookie(
			'betafantasycalendar_remember',
			$user_id.':'.$selector.':'.base64_encode($authenticator),
			$expiryTime,
			'/',
			getenv('COOKIEADDRESS')
		);
		
	}
	
}
	
?>