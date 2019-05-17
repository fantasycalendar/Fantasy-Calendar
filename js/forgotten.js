$(document).ready(function(){
	$.validator.addMethod("password_check", function(value){
		return /^[A-Za-z0-9\d=!\-@._*]*$/.test(value) // consists of only these
			&& /[A-Z]/.test(value) // has an uppercase letter
			&& /\d/.test(value) // has a digit
			&& value.length > 6 // has more than 6 characters
	});
	var getUrlParameter = function getUrlParameter(sParam) {
		var sPageURL = decodeURIComponent(window.location.search.substring(1)),
			sURLVariables = sPageURL.split('&'),
			sParameterName,
			i;

		for (var i = 0; i < sURLVariables.length; i++) {
			sParameterName = sURLVariables[i].split('=');

			if (sParameterName[0] === sParam) {
				return sParameterName[1] === undefined ? true : sParameterName[1];
			}
		}
	};

	var password_change_validator = $("#password-change-form");

	if(password_change_validator.length)
	{

		var key = getUrlParameter('key');

		password_change_validator.validate({
			errorLabelContainer: "#password-change-messagebox",
			wrapper: "div",
			errorClass: 'alert alert-danger',
			rules: {
				new_password: {
					required: true,
					password_check: true
				},
				new_password_again: {
					required: true,
					equalTo: "#new_password"
				}
			},
			messages: {
				new_password: {
					required: "Please enter a password.",
					password_check: "Please enter a password longer than 6 characters that contains at least one digit and one upper-case character."
				},
				new_password_again: {
					equalTo: "Passwords do not match."
				}
			},
			submitHandler: function(form){
				$('#password-change-button').attr("disabled","disabled");
				$.ajax({
					url:window.baseurl+"ajax/ajax_user", //the page containing php script
					type: "post", //request type,
					dataType: 'jsonp',
					
					data: {
						action: 'change_password',
						password: $('#new_password').val(),
						key: key
					},
					success: function(result){

						$('#password-change-form')[0].reset();
					
						$('#password-change-successbox').append('<div style=""><label class="alert alert-success" style="">Password has been changed! You can now log in with this password.</label></div>');
								
					},
					error: function ( log )
					{
						console.log(log);
					}
				});
			}
		});
	}

	var forgotten_password_validator = $("#forgotten-password-form")

	if(forgotten_password_validator.length)
	{

		forgotten_password_validator.validate({
			errorLabelContainer: "#forgotten-password-messagebox",
			wrapper: "div",
			errorClass: 'alert alert-danger',
			rules: {
				email: {
					required: true,
					email: true
				}
			},
			messages: {
				email:{
					required: "Please enter a valid email."
				}
			},
			submitHandler: function(form){
				$('#forgotten-password-button').attr("disabled","disabled");
				$('#forgotten-password-button').attr("display","none");
				$.ajax({
					url:window.baseurl+"ajax/ajax_user", //the page containing php script
					type: "post", //request type,
					dataType: 'json',
					data: {
						action: 'forgotten',
						email: $('#email').val()
					},
					success: function(result){

						$('#forgotten-password-form')[0].reset();

						$('#forgotten-password-successbox').append('<div style=""><label class="alert alert-success" style="">An email containing the reset key has been sent to your email address!</label></div>');

					},
					error: function ( log )
					{
						console.log(log);
					}
				});
			}

		});
		
		var error = getUrlParameter('error');

		if(error == 'invalidkey')
		{

			$("#forgotten-password-form").validate().showErrors({
				"": "This key is either not valid or has expired."
			});

		}
	}

});
