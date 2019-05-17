


$(document).ready(function(){

	$('body').css('display', 'block');
	
	$('#weather_seed').val(parseInt(Math.random().toString().substr(2)))

});

function save_calendar(){

	var json = JSON.stringify(calendar);

	console.log(calendar);
	
	$('#btn_save').prop('disabled', true);

	$.ajax({
		url:window.baseurl+"ajax/ajax_calendar",
		type: "post",
		data: {action: 'create', name: $('#calendar_name').val(), data: json},
		success: function(result){
			window.onbeforeunload = null;
			setTimeout(function(){
				window.location.href = 'calendar?action=view&id='+result;
			}, 10)
		},
		error: function ( log )
		{
			console.log(log);
		}
	});

}

var external_view = false;
var showcase_view = false;
var owned = true;
var type_of_view = 'generate';
  
$('#myTab a').click(function (e) {
	e.preventDefault();
	$(this).tab('show');
})