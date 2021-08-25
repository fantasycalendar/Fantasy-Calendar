var utcDate1 = Date.now();

var registered_click_callbacks = {}
var registered_keydown_callbacks = {}
var registered_onfocus_callbacks = {}
var registered_onblur_callbacks = {}
var registered_mousemove_callbacks = {}

function bind_calendar_events(){

	document.addEventListener('keydown', function(event){
		for(var callback_id in registered_keydown_callbacks){
			registered_keydown_callbacks[callback_id](event);
		}
	});

	document.addEventListener('click', function(event){
		for(var callback_id in registered_click_callbacks){
			registered_click_callbacks[callback_id](event);
		}
	});

	window.onfocus = function(event){
		for(var callback_id in registered_onfocus_callbacks){
			registered_onfocus_callbacks[callback_id](event);
		}
	};

	window.onblur = function(event){
		for(var callback_id in registered_onblur_callbacks){
			registered_onblur_callbacks[callback_id](event);
		}
	};

	window.addEventListener('mousemove', function(event){
		for(var callback_id in registered_mousemove_callbacks){
			registered_mousemove_callbacks[callback_id](event);
		}
	});

	$('body').addClass('page-focused').removeClass('page-unfocused');

	registered_onfocus_callbacks['page_focused'] = function(){
		setTimeout(function(){ $('body').addClass('page-focused').removeClass('page-unfocused'); }, 140);
	}

	registered_onblur_callbacks['page_unfocused'] = function(){
		$('body').addClass('page-unfocused').removeClass('page-focused');
	}

	$('#input_collapse_btn').click(function(){
	    toggle_sidebar();
	});

	calendar_weather.tooltip.set_up();

	$('#calendar_container').on('scroll', function(){
		calendar_weather.tooltip.hide();
		evaluate_era_position();
	});

	$(document).on('change', '.event-text-input', function() {

		var parent = $(this).closest('.sortable-container');

		var value_input = this;

		var output = parent.find('.event-text-output');
		var input = parent.find('.event-text-input');

		output.each(function() {

			var classes = $(this).attr('class').split(' ');

			if (classes.indexOf("hidden_event") > -1) {
				classes.length = 4;
			} else {
				classes.length = 3;
			}

			classes.push($(value_input).val());
			classes.push(input.not(value_input).val());

			classes = classes.join(' ');

			$(this).prop('class', classes);

		})

	});

}

var evaluate_era_position = debounce(function(){
	eras.evaluate_position();
}, 50);

function eval_apply_changes(output){

	var apply_changes_immediately = $('#apply_changes_immediately');

	if(apply_changes_immediately.length == 0){
		output();
	}else if(!apply_changes_immediately.is(':checked')){
		if(!changes_applied){
			evaluate_save_button();
			show_changes_button();
		}else{
			hide_changes_button();
			evaluate_save_button(true);
			output();
		}
	}else{
		evaluate_save_button();
		output();
	}

}

function pre_rebuild_calendar(action, dynamic_data){

	eval_apply_changes(function(){

		rebuild_calendar(action, dynamic_data);

	});

}

var evaluated_static_data = {};

async function rebuild_calendar(action, dynamic_data){

    calendar_data_generator.static_data = static_data;
    calendar_data_generator.dynamic_data = dynamic_data;
    calendar_data_generator.owner = Perms.player_at_least('co-owner');
    calendar_data_generator.events = events;
    calendar_data_generator.event_categories = event_categories;

    execution_time.start();

    calendar_data_generator.run().then(result => {

        evaluated_static_data = result;

        rerender_calendar(evaluated_static_data);

        calendar_weather.epoch_data = evaluated_static_data.epoch_data;
        calendar_weather.processed_weather = evaluated_static_data.processed_weather;
        calendar_weather.start_epoch = evaluated_static_data.year_data.start_epoch;
        calendar_weather.end_epoch = evaluated_static_data.year_data.end_epoch;

        climate_charts.evaluate_day_length_chart();
        climate_charts.evaluate_weather_charts();

        eval_clock();

        update_cycle_text();

    }).catch(result => {
        let errors = result.errors.map(e => { return `<li>${e}</li>` });
        error_message(`Errors:<ol>${errors.join()}</ol>`);
    });

}

async function rebuild_climate(){

    let climate_generator = new Climate(
        evaluated_static_data.epoch_data,
        static_data,
        dynamic_data,
        dynamic_data.year,
        evaluated_static_data.year_data.start_epoch,
        evaluated_static_data.year_data.end_epoch
    );

    let prev_seasons = calendar_weather.processed_seasons;
    let prev_weather = calendar_weather.processed_weather;

    climate_generator.generate().then((result) => {

        calendar_weather.epoch_data = result;
        evaluated_static_data.epoch_data = result;

        climate_charts.evaluate_day_length_chart();
        climate_charts.evaluate_weather_charts();

        if(prev_seasons !== climate_generator.process_seasons || prev_weather !== climate_generator.process_weather) {
            rerender_calendar();
            eval_clock();
        }else{
            eval_current_time();
        }

    })
}

function rerender_calendar(processed_data) {

	if (processed_data === undefined) processed_data = evaluated_static_data;

	RenderDataGenerator.create_render_data(processed_data).then((result) => {
        window.dispatchEvent(new CustomEvent('render-data-change', { detail: result }));
    }).catch((err) => {
        $.notify(err);
    });
}
