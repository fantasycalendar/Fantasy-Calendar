function update_current_day(recalculate){

	if(recalculate){
		dynamic_data.epoch = evaluate_calendar_start(static_data, convert_year(static_data, dynamic_data.year), dynamic_data.timespan, dynamic_data.day).epoch;
	}

	window.dispatchEvent(new CustomEvent('update-epochs', {detail: {
		current_epoch: dynamic_data.epoch,
		preview_epoch: preview_date.follow ? dynamic_data.epoch : preview_date.epoch
	}}));

	evaluate_sun();

}

scroll_attempts = 0;

function scroll_to_epoch(){

	if($(`[epoch=${preview_date.epoch}]`).length){
		scroll_attempts = 0;
		return $(`[epoch=${preview_date.epoch}]`)[0].scrollIntoView({block: "center", inline: "nearest"});
	}else if($(`[epoch=${dynamic_data.epoch}]`).length){
		scroll_attempts = 0;
		return $(`[epoch=${dynamic_data.epoch}]`)[0].scrollIntoView({block: "center", inline: "nearest"});
	}

	scroll_attempts++;

	if(scroll_attempts < 10){
		setTimeout(scroll_to_epoch, 100);
	}else{
		scroll_attempts = 0;
	}

}
