$(document).ready(function(){
	$.validator.addMethod("password_check", function(value){
		return /^[A-Za-z0-9\d=!\-@._*]*$/.test(value) // consists of only these
			&& /[A-Z]/.test(value) // has an uppercase letter
			&& /\d/.test(value) // has a digit
			&& value.length > 6 // has more than 6 characters
	});

	var registrationValidator = $("#signup-form").validate({
		errorLabelContainer: "#signup_messagebox",
		wrapper: "div",
		errorClass: 'alert alert-danger',
		rules: {
			username: {
				required: true,
				minlength: 2,
				remote:{
					url: window.baseurl+'ajax/ajax_username_validate',
					type: 'post',
					data:{
						username: function(){
							return $('#signup_username').val();
						}
					}
				}
			},
			email: {
				required: true,
				email: true,
				remote:{
					url: window.baseurl+'ajax/ajax_email_validate',
					type: 'post',
					data:{
						email: function(){
							return $('#signup_email').val();
						}
					}
				}
			},
			password: {
				required: true,
				password_check: true
			},
			password_again: {
				required: true,
				equalTo: "#signup_password"
			}
		},
		messages: {
			username: {
				required: "Please enter a valid username.",
				minlength: jQuery.validator.format("Your username must have at least {0} characters."),
				remote: jQuery.validator.format("{0} is in use. Have you forgotten your password?")
			},
			email:{
				required: "Please enter a valid email.",
				remote: jQuery.validator.format("{0} is in use. Have you forgotten your password?")
			},
			password: {
				required: "Please enter a password.",
				password_check: "Please enter a password longer than 6 characters that contains at least one digit and one upper-case character."
			},
			password_again: {
				equalTo: "Passwords do not match."
			}
		},
		submitHandler: function(form){
			$('#signup_button').attr("disabled","disabled");
			jQuery.ajax({
				url:window.baseurl+'ajax/ajax_user', //the page containing php script
				type: "post", //request type,
				data: {
					action: 'signup',
					username: $('#signup_username').val(),
					email: $('#signup_email').val(),
					password: $('#signup_password').val(),
					password2: $('#signup_password2').val()
				},
				success: function(result){
					if(result){
						$('#signup_successbox').append('<div style=""><label class="alert alert-success" style="">A confirmation link has been sent to your email! Please check your spam folder just in case.</label></div>');
					}
				},
				error: function ( log )
				{
					console.log(log);
				}
			});
		}
	});
});
