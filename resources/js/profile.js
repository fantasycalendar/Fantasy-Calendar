$(document).ready(function(){
	
	
	if($("#profile-update-form").length)
	{
		
		$.validator.addMethod("password_check", function(value) {
			if($('#new_password').val().length == 0 && $('#new_password2').val().length == 0){
				return true;
			}
			else
			{
				return /^[A-Za-z0-9\d=!\-@._*]*$/.test(value) // consists of only these
					&& /[A-Z]/.test(value) // has an uppercase letter
					&& /\d/.test(value) // has a digit
					&& value.length > 6 // has more than 6 characters
			}
		});
		
		var updateProfileValidator = $("#profile-update-form").validate({
			errorLabelContainer: "#profile-update-messagebox",
			wrapper: "div",
			errorClass: 'alert alert-danger',
			rules: {
				password: {
					required: true
				},
				new_password: {
					required: false,
					password_check: true
				},
				new_password_again: {
					required: false,
					equalTo: "#new_password"
				},
				new_email: {
					required: false,
					email: true,
					remote:{
						url: window.baseurl+"ajax/ajax_email_validate",
						type: 'post',
						data: {email: $('#new_email').val()},
						data:{
							email: function(){
								return $('#new_email').val();
							}
						}
					}
				},
				new_email_again: {
					required: false,
					equalTo: "#new_email"
				},
			},
			messages: {
				password: {
					required: "Please enter your current password."
				},
				new_password: {
					password_check: "Please enter a password longer than 6 characters that contains at least one digit and one upper-case character."
				},
				new_password_again: {
					equalTo: "Passwords do not match."
				},
				new_email:{
					remote: jQuery.validator.format("{0} is already in use.")
				},
				new_email_again:{
					equalTo: "Passwords do not match."
				}
			},
			submitHandler: function(form){
				$('#profile-update-button').attr("disabled","disabled");
				$('#profile-update-successbox').empty();
				$.ajax({
					url:window.baseurl+"ajax/ajax_user", //the page containing php script
					type: "post",
					data: {
						action: "update",
						password: $('#curr_password').val(),
						new_password: $('#new_password').val(),
						new_password2: $('#new_password2').val(),
						new_email: $('#new_email').val(),
						new_email2: $('#new_email2').val()
					},
					success: function(result){
						
						$('#profile-update-form')[0].reset();
						
						var error = {};
						
						$.each(result, function (key, data) {
							$.each(data, function (index, data) {
								if(index.split(' ')[0] == 'success')
								{
									$('#profile-update-successbox').append('<div style=""><label class="alert alert-success" style="">'+data+'</label></div>');
								}
								else
								{
									actual_index = index.split(' ')[1];
									error[actual_index] = data;
									updateProfileValidator.showErrors(error);
								}	
							})
						})
						
						$('#profile-update-button').removeAttr('disabled');
						
					},
					error: function ( log )
					{
						console.log(log);
					}
				});
			}
		});
		
	}
	
});