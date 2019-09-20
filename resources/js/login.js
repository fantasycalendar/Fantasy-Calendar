$(document).ready(function(){

	$('.image_link').click(function(e){
		if($(this).children().first().attr('title') == 'Duplicate'){
			if(!confirm("Are you sure you want to duplicate this calendar?")){
    			e.preventDefault();
    		}
		}
	});

	if($("#login-form").length)
	{
		// Login buttons and events
		$(".basic-container").click(function(e){
			e.stopPropagation();
		});

		$("#login-show-button").click(function(){
			$("#login-background").fadeIn(150);
			$("#login_username").focus();
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
				username: "required",
				password: "required"
			},
			messages: {
				username: "Please enter a username.",
				password: "Please enter a password."
			},
			submitHandler: function(form){
				$('#login_button').attr("disabled","disabled");
				$.ajax({
					url:window.baseurl+"login",
					type: "post",
					dataType: 'json',
					data: {username: $('#login_username').val(), password: $('#login_password').val(), remember: $('#login_rememberMe').is(':checked')},
					success: function(result){
						location.reload();
					},
					error: function ( log )
					{
						console.log(log);
						loginValidator.showErrors(
							log.responseJSON.errors
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
		url:window.baseurl+"logout",
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
