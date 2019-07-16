<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require_once 'phpmailer/Exception.php';
require_once 'phpmailer/PHPMailer.php';
require_once 'phpmailer/SMTP.php';

require_once 'c_db.php';
require_once 'c_auth_token.php';

define("MAX_LOGINS", 5);
define("LOGIN_TIMEOUT", 300);

class user
{
	private $database;
	private $authtoken;

	private $max_logins = MAX_LOGINS;
	private $login_timeout = LOGIN_TIMEOUT;

	function __construct()
	{
		
		$this->database = new Database();
	
		$this->authtoken = new auth_token($this->database);
	
	}
	#This function checks if your cookie is valid and logs you in if that's the case
	public function validate_cookie()
	{
	
		#If you're not logged in and there's a cookie
		if(empty($_SESSION['user_id']) && !empty($_COOKIE['betafantasycalendar_remember']))
		{
			
			#Split the cookie's data into the selector and the authenticator
			list($user_id, $selector, $authenticator) = explode(':', $_COOKIE['betafantasycalendar_remember']);
			
			#Select all the data from the database with the selector
			$sql = 	"SELECT id, token, expires
					 FROM auth_tokens
					 WHERE selector = :selector
					 LIMIT 1";
			
			
			$this->database->query($sql);
			
			$this->database->bind(':selector', $selector);
			
			$result = $this->database->single();
			
			if(!empty($result))
			{

				#then, check if the token from the database matches the hashed authenticator
				if(hash_equals($result['token'], hash('sha256', base64_decode($authenticator))))
				{
					
					#Create (or update) authentication token
					$this->authtoken->create($user_id);
					
					$user = $this->get_user($user_id);

					#Set the current logged in user to be the found user id in the auth-token table
					$_SESSION['user_id'] = $user['id'];
					$_SESSION['permission'] = $user['permission'];
					$_SESSION['beta'] = $user['beta'] == "true";

					return true;
					
				}else{
					
					$this->authtoken->removeAllByUserID($user_id);
					
					return array("error" => "Your 'remember-me' cookie is invalid. For security purposes, all of your logins have been invalidated, and you will need to log in again.");
					
				}
			}
		}
	}

	public function get_user($id = null, $username = null, $email = null)
	{
		#Find user with this username
		$sql = 	'SELECT u.id, u.username, u.password, p.name as permission, u.email, u.active, IF(u.beta_authorised = 1, "true", "false") as beta
				 FROM users u
				 	INNER JOIN permissions p
						on p.id = u.permissions
				 WHERE u.username = :username OR u.id = :id OR u.email = :email OR u.email = :username
				 LIMIT 1';
		
		$this->database->query($sql);
		
		$this->database->bind(':id', $id);
		$this->database->bind(':username', $username);
		$this->database->bind(':email', $email);

		$user = $this->database->single();

		return $user;

	}

	private function remove_attempts($username){

		$sql = "DELETE FROM login_attempts where ip = :ip and username = :username";
		
		$this->database->query($sql);
	
		#Bind the parameters to the query
		$this->database->bind(':ip', $_SERVER['REMOTE_ADDR']);
		$this->database->bind(':username', $username);
		
		$this->database->execute();

	}


	private function check_attempts($username){


		#Find user with this username
		$sql = 	"SELECT l.attempts, l.last_login
				 FROM login_attempts l
				 WHERE l.username = :username
				 LIMIT 1";
		
		$this->database->query($sql);
		
		$this->database->bind(':username', $username);

		$user_attempts = $this->database->single();

		$num_attempts = $user_attempts['attempts'];

		$date_now = date("Y-m-d H:i:s");
		$old_time = strtotime($user_attempts['last_login']);
		$new_time = strtotime($date_now);
        $timeDiff = $new_time - $old_time;

		if($num_attempts >= $this->max_logins && $timeDiff < $this->login_timeout){

			return false;

		}elseif($num_attempts && $timeDiff < $this->login_timeout){

			$num_attempts++;
		
			$sql = "UPDATE login_attempts SET attempts = :attempts, last_login = :last_login where ip = :ip and username = :username";
		
			$this->database->query($sql);

			$this->database->bind(':attempts', $num_attempts);

		}else{
		
			$sql = "INSERT INTO login_attempts( ip, attempts, last_login, username ) VALUES ( :ip, 1, :last_login, :username ) ON DUPLICATE KEY UPDATE attempts = 1, last_login = :last_login";
		
			$this->database->query($sql);

		}
		
		#Bind the parameters to the query
		$this->database->bind(':ip', $_SERVER['REMOTE_ADDR']);
		$this->database->bind(':last_login', date("Y-m-d H:i:s"));
		$this->database->bind(':username', $username);
		
		return $this->database->execute();

	}

    
	#This function logs you in
    public function logIn($username, $password, $remember)
	{
		#Start timing for artificial delay
		$time_start = microtime(true);

		if(!$this->check_attempts($username)){

			usleep(500000-(microtime(true)-$time_start)*100000);
			
			return array("error" => "Maximum number of login attempts exceeded. Please wait 5 minutes before logging in again.");

		}

        $user = $this->get_user(null, $username);

		if(!empty($user) && $user['active'] == 0){

			usleep(500000-(microtime(true)-$time_start)*100000);
			
			return array("error" => "You haven't confirmed your account yet! <a href='resend_email.php'>Resend your confirmation email?</a>");
		}

		if(password_verify($password, $user['password'])){
			
			#If the user wants to remain logged in on this device
			if($remember)
			{
				
				#Then, create (or update) authentication token for the user
				$this->authtoken->create($user['id']);
				
			}

			#Remove the current amount of attempts from the current IP if they successfully log in
			$this->remove_attempts($username);
		
			#Sleep for 0.5 seconds, minus the current execution time
			usleep(500000-(microtime(true)-$time_start)*100000);
			
			#Set the current user_id to be the found user in the database
			$_SESSION['user_id'] = $user['id'];
			$_SESSION['permission'] = $user['permission'];
			$_SESSION['beta'] = $user['beta'] == "true";
			
			return array("success" => "You have been logged in!");

		}else{

				
			#Still sleep, in case someone's trying to find users with this username
			usleep(500000-(microtime(true)-$time_start)*100000);
			
			return array("error" => "Wrong username or password.");
	
		}

    }
	
	#This function logs you out
	public function logout()
	{
	
		$this->authtoken->remove();
		
		#Unset the current session
		session_destroy();
		
		#Then invalidate the cookie
		setcookie(
			'fantasycalendar_remember',
			'',
			time()-1,
			'/',
			'127.0.0.1'
		);
		
		return true;
		
	}
	
	#This function signups the new user
	public function signup($username, $email, $password, $password2)
	{
					
		#Create an email key for the user
		$email_key = bin2hex(random_bytes(32));

		$subject = 'Confirm registration @ fantasy-calendar';
		$message = 'Welcome! You have registered at fantasy-calendar.com!<br>
					Before you can access your account, you must confirm your email address by clicking the verification link below:<br>
					<a href="'.getenv('WEBADDRESS').'confirm.php?key='.$email_key.'">Verification Link</a><br>
					This link will expire in <b>24 hours</b>, so please click it sooner rather than later.<br><br>
					Thank you,<br>
					Adam @ Fantasy-Calendar.com';
		
		$sent = $this->send_email($email, $subject, $message);

		#If it was successfully sent
		if($sent)
		{
			#Hash the password
			$hashed_password = password_hash($password, PASSWORD_DEFAULT);
		
			#Prepare the query
			$sql = "INSERT INTO users( username, email, password, reg_ip ) VALUES ( :username, :email, :password, :ip  )";
			
			#Send the query
			$this->database->query($sql);
			
			#Bind the parameters to the query
			$this->database->bind(':username', $username);
			$this->database->bind(':email', $email);
			$this->database->bind(':password', $hashed_password);
			$this->database->bind(':ip', $_SERVER['REMOTE_ADDR']);
			
			$this->database->execute();

			$user_id = $this->database->lastInsertId();

			if(!empty($user_id))
			{
				$plus_24_hours = time()+(24*60*60);
				$expires = date('Y-m-d H:i:s', $plus_24_hours);
				
				#Prepare the query
				$sql = "INSERT INTO confirm( user_id, email_key, expires ) VALUES ( :user_id, :email_key, :expires)";

				#Send the query
				$this->database->query($sql);
				
				#Bind the parameters to the query
				$this->database->bind(':user_id', $user_id);
				$this->database->bind(':email_key', $email_key);
				$this->database->bind(':expires', $expires);
				
				$this->database->execute();
				
				return true;
				
			}
			else
			{
				return array("error" => "Other error.");
			}
		}
		else
		{
			
			return array("error" => "Message delivery failed...");
			
		}
		
	}

	public function resend_activation($email){
		
		$time_start = microtime(true);

		$user = $this->get_user(null, null, $email);

		if($user && $user['active'] == 0)
		{

			$sql = "DELETE FROM confirm WHERE user_id = :user_id";
			
			$this->database->query($sql);

			$this->database->bind(':user_id', $user['id']);
				
			$this->database->execute();

			#Create an email key for the user
			$email_key = bin2hex(random_bytes(32));

			$subject = 'Confirm registration @ fantasy-calendar';
			$message = 'Welcome! You have registered at fantasy-calendar.com!<br>
						Before you can access your account, you must confirm your email address by clicking the verification link below:<br>
						<a href="'.getenv('WEBADDRESS').'confirm.php?key='.$email_key.'">Verification Link</a><br>
						This link will expire in <b>two hours</b>, so please click it sooner rather than later.<br><br>
						Thank you,<br>
						Adam @ Fantasy-Calendar.com';
			
			$sent = $this->send_email($email, $subject, $message);

			#If it was successfully sent
			if($sent)
			{

				$plus_two_hours = time()+7200;
				$expires = date('Y-m-d H:i:s', $plus_two_hours);
				
				#Prepare the query
				$sql = "INSERT INTO confirm( user_id, email_key, expires ) VALUES ( :user_id, :email_key, :expires)";

				#Send the query
				$this->database->query($sql);
				
				#Bind the parameters to the query
				$this->database->bind(':user_id', $user['id']);
				$this->database->bind(':email_key', $email_key);
				$this->database->bind(':expires', $expires);
				
				$this->database->execute();

			}
		}

		usleep(500000-(microtime(true)-$time_start)*100000);
		return true;

	}
	
	#This function signups the new user
	public function forgotten_password($email)
	{
		
		$user = $this->get_user(null, null, $email);

		if($user)
		{

			#Create an email key for the user
			$email_key = bin2hex(random_bytes(32));

			$subject = 'Forgotten password @ fantasy-calendar';
			$message = 'Hello '.$user['username'].'!<br>
						Recently, we got a request to reset the password for your account at our website, and if this is the case, please press the link below:<br>
						<a href="'.getenv('WEBADDRESS').'forgotten_password.php?key='.$email_key.'">Reset your password.</a><br>
						This link will expire in <b>two hours</b>, so please click it sooner rather than later.<br><br>
						If you were not the one to make this request, please ignore this email.<br><br>
						Thank you,<br>
						Adam @ Fantasy-Calendar.com';
			
			$sent = $this->send_email($email, $subject, $message);

			#If it was successfully sent
			if($sent)
			{

				$plus_two_hours = time()+7200;

				$expires = date('Y-m-d H:i:s', $plus_two_hours);
				
				#Prepare the query
				$sql = "INSERT INTO forgotten( user_id, email_key, expires ) VALUES ( :user_id, :email_key, :expires)";

				#Send the query
				$this->database->query($sql);
				
				#Bind the parameters to the query
				$this->database->bind(':user_id', $user['id']);
				$this->database->bind(':email_key', $email_key);
				$this->database->bind(':expires', $expires);
				
				$this->database->execute();

				return array("success" => "An email containing the reset key has been sent to your email address!");

			}
			else
			{

				return array("error" => "Message delivery failed...");

			}

		}
		else
		{
			
			return array("success" => "An email containing the reset key has been sent to your email address!");

		}
		
	}

	public function send_email($email, $subject, $message)
	{

		$mail = new PHPMailer(true);

		try{
			
			$mail->isSMTP();

			$mail->SMTPDebug = 0;

			$mail->Host = getenv('MAIL_HOST');
			$mail->Port = getenv('MAIL_PORT');
			
			$mail->SMTPSecure = 'ssl';
			$mail->SMTPAuth = true;
			
			$mail->Username = getenv('MAIL_USER');
			$mail->Password = getenv('MAIL_PASS');
			
			//Recipients
			$mail->setFrom('fantasycalendar@fantasy-calendar.com');
			$mail->addAddress($email);

			$mail->addCustomHeader('MIME-Version: 1.0');
			$mail->addCustomHeader('Content-Type: text/html; charset=ISO-8859-1');
			$mail->addCustomHeader('X-Priority: 3\r\n');
			$mail->addCustomHeader('X-Mailer: PHP'. phpversion() .'\r\n');

			//Content
			$mail->isHTML(true);
			$mail->Subject = $subject;
			$mail->Body    = $message;

			return $mail->send();
			
		} catch (Exception $e) {
			echo 'Message could not be sent.';
			echo 'Mailer Error: ' . $mail->ErrorInfo;
		}
		
	}

	public function confirm_user($email_key)
	{
		
		#Find user with this username
        $sql = 	"SELECT c.user_id, c.expires, u.active
				 FROM confirm c
					  JOIN users u
						   on c.user_id = u.id
				 WHERE c.email_key = :email_key
				 LIMIT 1";
		
		
		#Send the query
		$this->database->query($sql);
		
		#Bind the parameters to the query
		$this->database->bind(':email_key', $email_key);
		
		if($user = $this->database->single())
		{
			if($user['active'] == 0)
			{
				if(time() < strtotime($user['expires']))
				{
					
					#Prepare the query
					$sql = "UPDATE users
							SET active = 1
							WHERE id = :user_id";
					
					#Send the query
					$this->database->query($sql);
					
					#Bind the parameters to the query
					$this->database->bind(':user_id', $user['user_id']);
					
					if($this->database->execute())
					{
						
						#Find user with this username
						$sql = 	"DELETE FROM confirm
								 WHERE email_key = :email_key
								 LIMIT 1";
						
						#Send the query
						$this->database->query($sql);
						
						#Bind the parameters to the query
						$this->database->bind(':email_key', $email_key);
						
						if($this->database->execute())
						{
							return array("success" => "Your account has been activated! You can now log in with your username and password.");
						}
						else
						{
							return array("error" => "Something went wrong, couldn't remove confirmation key from database.");
						}
					}
					else
					{
						return array("error" => "Something went wrong, couldn't activate user.");
					}
				}
				else
				{
					return array("error" => "This confirmation key has expired. <a href='resend_email.php'>Resend confirmation email?</a>");
				}
			}
			else
			{
				return array("error" => "This account has already been activated.");
			}
		}
		else
		{
			return array("error" => "This confirmation key is invalid.");
		}
	}

	public function reset_password($email_key)
	{
		
		#Find user with this username
        $sql = 	"SELECT user_id, expires
				 FROM forgotten 
				 WHERE email_key = :email_key
				 LIMIT 1";
		
		#Send the query
		$this->database->query($sql);
		
		#Bind the parameters to the query
		$this->database->bind(':email_key', $email_key);
		
		if($user = $this->database->single())
		{
			if(time() < strtotime($user['expires']))
			{

				return true;

			}
			else
			{
				return array("error" => "This key has expired. <a href='forgotten_password.php'>Please send a new email here.</a>");
			}
		}
		else
		{
			return array("error" => "This confirmation key is invalid.");
		}

	}
	
	
	public function update_forgotten_password($new_password, $email_key)
	{

		#Find user with this username
		$sql = 	"SELECT user_id
				 FROM forgotten 
				 WHERE email_key = :email_key
				 LIMIT 1";
		
		#Send the query
		$this->database->query($sql);
		
		#Bind the parameters to the query
		$this->database->bind(':email_key', $email_key);
		
		$user = $this->database->single();

		if($user)
		{

			$this->update_password($user['user_id'], $new_password);

			#Find user with this username
			$sql = 	"DELETE FROM forgotten
					 WHERE email_key = :email_key
					 LIMIT 1";
			
			#Send the query
			$this->database->query($sql);
			
			#Bind the parameters to the query
			$this->database->bind(':email_key', $email_key);
			
			if($this->database->execute())
			{

				return true;

			}
			else
			{
				return array("error" => "Something went wrong, couldn't remove reset key from database.");
			}
		}
	}

	public function update_email($id, $new_email)
	{
	
		#Prepare the query
		$sql = "UPDATE users
				SET email = :email
				WHERE id = :id";
		
		#Send the query
		$this->database->query($sql);
		
		#Bind the parameters to the query
		$this->database->bind(':email', $new_email);
		$this->database->bind(':id', $id);
		
		return $this->database->execute();
		
	}
	
	public function update_password($id, $new_password)
	{
		
		$this->authtoken->removeAllByUserID($id);
		
		#The new password is hashed
		$password = password_hash($new_password, PASSWORD_DEFAULT);
		
		#Sore the current time
		$datetime = date("Y-m-d H:i:s");
	
		#Prepare the query
		$sql = "UPDATE users
				SET password = :password,
					date_update_pass = :lastChanged
				WHERE id = :id";
		
		#Send the query
		$this->database->query($sql);
		
		#Bind the parameters to the query
		$this->database->bind(':password', $password);
		$this->database->bind(':lastChanged', $datetime);
		$this->database->bind(':id', $id);
		
		return $this->database->execute();
		
	}
	#This function updates the supplied user's password (or the current logged in user)
	public function update_profile($password, $new_password, $new_password2, $new_email, $new_email2)
	{
		
		$id = $_SESSION['user_id'];

		$user = $this->get_user($id);
		
		$return = [];
		
		if(password_verify($new_password, $user['password']))
		{
			return array(array('error new_password' => 'Please enter a new password, and not your current.'));
		}
		
		#If the user was found, the password matches the database
		if(!empty($user) and password_verify($password, $user['password']))
		{
		
			#If a new password was supplied, and it matches the other password, change it
			if(!empty($new_password) && !empty($new_password2) && $new_password === $new_password2)
			{
				
				if($this->update_password($id, $new_password))
				{
				
					$return[] = array('success' => 'Password successfully updated.');
				
				}
				
			}
			
			#And if a new email was supplied, and it matches the other email, change it
			if(!empty($new_email) && !empty($new_email2) && $new_email === $new_email2)
			{
				if($this->update_email($id, $new_email))
				{
					
					$return[] = array('success' => 'Email successfully updated.');
				
				}
			}
		}
		else
		{
			$return[] = array('error' => 'Wrong password.');
		}
		
			
		return $return;
		
	}
	
	#This function checks if the username is in use
	public function verify_username($username)
	{
		#Start timing for artificial delay
		$time_start = microtime(true);
        
		#Find the amount of users with this username (1 or 0)
        $sql = 	"SELECT username 
				 FROM users
				 WHERE username = :username";
			
		#Send the query
		$this->database->query($sql);
		
		#Bind the parameters to the query
		$this->database->bind(':username', $username);
		
		$result = $this->database->single();
		
		usleep(500000-(microtime(true)-$time_start)*100000);
		
		return $result;
		
	}
	
	#This function checks if the email is in use
	public function verify_email($email)
	{
		#Start timing for artificial delay
		$time_start = microtime(true);
        
		#Find the amount of users with this username (1 or 0)
        $sql = 	"SELECT email 
				 FROM users
				 WHERE email = :email";
			
		#Send the query
		$this->database->query($sql);
		
		#Bind the parameters to the query
		$this->database->bind(':email', $email);
		
		$this->database->execute();
		
		$result = $this->database->rowCount();
		
		usleep(500000-(microtime(true)-$time_start)*100000);
		
		return $result;
	
	}
    
}

?>
