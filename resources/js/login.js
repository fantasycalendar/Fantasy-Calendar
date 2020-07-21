$(document).ready(function(){

	if($("#login-form").length)
	{
		// Login buttons and events
		$(".basic-container").click(function(e){
			e.stopPropagation();
		});

		$("#login-show-button").click(function(){
			$("#login-background").fadeIn(150);
			$("#login_identity").focus();
		});

		$("#login-background").click(function(){
			$("#login-background").fadeOut(150);
			loginValidator.resetForm();
		});

		jQuery.validator.addClassRules('#login_password', {
			required: true
		});

		var loginValidator = $("#login-form").validate({
			errorLabelContainer: "#login_messagebox",
			wrapper: "div",
			errorClass: 'alert alert-danger',
			rules: {
				identity: "required",
				password: "required"
			},
			messages: {
				identity: "Please enter a username or email.",
				password: "Please enter a password."
			},
			submitHandler: function(form){
				$('#login_button').attr("disabled","disabled");
				$.ajax({
					url:window.baseurl+"login",
					type: "post",
					dataType: 'json',
					data: {identity: $('#login_identity').val(), password: $('#login_password').val(), remember: $('#login_rememberMe').is(':checked')},
					success: function(result){
						location.reload();
					},
					error: function ( log )
					{
					    let errors = log.responseJSON.errors;

						if(errors.hasOwnProperty('username')) {
                            errors['identity'] = errors['username'];
                            delete errors['username'];
                        } else if (errors.hasOwnProperty('email')) {
                            errors['identity'] = errors['email'];
                            delete errors['email'];
                        }

						loginValidator.showErrors(
							errors
						);
						$('#login_button').removeAttr('disabled');
					}
				});
			}
		});

		$("#login-form").form(function(e){
			e.stopPropagation();
		});

	}

	$('#logout-button').click(logout);

});

function logout(){
	$.ajax({
		url:"/logout",
		type: "post",
		dataType: "json",
		data: {action: "logout"},
		success: function(result){
			self.location = '/';
		},
		error: function ( log )
		{
			console.log(log);
		}
	});
}
