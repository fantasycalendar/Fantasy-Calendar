$(document).ready(function(){

	$("#resend-email-key-form").validate({
		errorLabelContainer: "#resend-email-key-messagebox",
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
			$('#resend-email-key-button').remove();
			$.ajax({
				url:window.baseurl+"ajax/ajax_user", //the page containing php script
				type: "post", //request type
				data: {
					action: 'resend',
					email: $('#email').val()
				},
				success: function(result){
					
					$('#resend-email-key-successbox').append('<div style=""><label class="alert alert-success" style="">An email containing the confirmation key has been resent to your email address!</label></div>');

				},
				error: function ( log )
				{
					console.log(log);
				}
			});
		}

	});

});
