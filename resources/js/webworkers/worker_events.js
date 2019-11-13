importScripts('/js/calendar/calendar_functions.js');
importScripts('/js/calendar/calendar_variables.js');


onmessage = e => {
	data = event_evaluator.init(e.data.static_data, e.data.epoch_data, e.data.event_id, e.data.callback);
	postMessage({
		event_data: data,
		callback: false
	});
}

var event_evaluator = {

	events: [],
	categories: [],

	start_epoch: 0,

	static_data: {},
	epoch_data: {},

	current_data: {},

	init: function(static_data, epoch_data, event_id, callback){

		this.static_data = static_data;
		this.epoch_data = epoch_data;

		this.callback = callback;

		this.event_data = {
			valid: {},
			starts: {},
			ends: {},
		}

		this.events_only_happen_once = [];

		this.start_epoch = Number(Object.keys(this.epoch_data)[0]);

		this.event_id = event_id;

		//execution_time.start();

		this.events = clone(this.static_data.event_data.events);
		this.categories = clone(this.static_data.event_data.categories);
		this.evaluate_valid_events(this.epoch_data, event_id);
		
		//execution_time.end();

		return this.event_data;

	},

	evaluate_valid_events: function(epoch_list, event_id){

		if(Object.keys(epoch_list).length == 0) return false;

		function evaluate_operator(operator, a, b, c){

			switch(operator){
				case '==':
					return a == b;
					break;
				case '!=':
					return a != b;
					break;
				case '>=':
					return a >= b;
					break;
				case '<=':
					return a <= b;
					break;
				case '>':
					return a > b;
					break;
				case '<':
					return a < b;
					break;
				case '%':
					c = (c-1)%b;
					return (a-c)%b==0;
					break;
				case '&&':
					return a&&b;
					break;
				case 'NAND':
					return !(a&&b);
					break;
				case '||':
					return a||b;
					break;
				case '^':
					return a^b;
					break;
			}
		}

		function evaluate_condition(array){

			data_value = []

			var category = array[0];
			var type = array[1];
			var values = array[2];

			var result = true;
			
			for(var i = 0; i < condition_mapping[category][type][1].length; i++){

				var subcon = condition_mapping[category][type][1][i];
				var selector = subcon[0];
				var operator = subcon[1];

				if(array[0] === "Epoch"){

					var selected = this.current_data[selector];
					var cond_1 = Number(values[subcon[2]]) != NaN ? Number(values[subcon[2]]) : values[subcon[2]];
					var cond_2 = values[subcon[3]] ? values[subcon[3]] : undefined;
					cond_2 = Number(cond_2) != NaN ? Number(cond_2) : cond_2;

				}else if(array[0] === "Moons"){

					var selected = this.current_data[selector][values[0]];
					var cond_1 = values[subcon[2]]|0;
					var cond_2 = values[subcon[3]] ? values[subcon[3]]|0 : undefined;

				}else if(array[0] === "Season"){

					var selected = this.current_data["season"][selector];
					var cond_1 = values[subcon[2]]|0;
					var cond_2 = values[subcon[3]] ? values[subcon[3]]|0 : undefined;

				}else if(array[0] === "Random"){

					var cond_1 = values[subcon[2]]|0;
					var cond_2 = values[subcon[3]] ? values[subcon[3]]|0 : undefined;
					var selected = fract(43758.5453 * Math.sin(cond_2 + (78.233 * this.current_data.epoch)))*100;

				}else if(array[0] === "Events"){

					var cond_1 = values[subcon[2]]|0;
					cond_1 = this.current_event.data.connected_events[cond_1];
					var cond_2 = values[subcon[3]]|0;

					if(event_evaluator.event_data.valid[cond_1] === undefined || event_evaluator.event_data.valid[cond_1].length == 0){

						var result = false;

					}else if(operator == "exactly_past"){

						for(var j = 0; j < event_evaluator.event_data.valid[cond_1].length; j++){

							var result = this.current_data.epoch == event_evaluator.event_data.valid[cond_1][j]+cond_2

							if(result) break;

						}

					}else if(operator == "exactly_future"){

						for(var j = 0; j < event_evaluator.event_data.valid[cond_1].length; j++){

							var result = this.current_data.epoch == event_evaluator.event_data.valid[cond_1][j]-cond_2

							if(result) break;

						}

					}else if(operator == "in_past_exc"){

						for(var j = 0; j < event_evaluator.event_data.valid[cond_1].length; j++){

							var result = this.current_data.epoch >= event_evaluator.event_data.valid[cond_1][j]-cond_2 && event_evaluator.event_data.valid[cond_1][j] > this.current_data.epoch

							if(result) break;

						}

					}else if(operator == "in_future_exc"){

						for(var j = 0; j < event_evaluator.event_data.valid[cond_1].length; j++){

							var result = this.current_data.epoch <= event_evaluator.event_data.valid[cond_1][j]+cond_2 && event_evaluator.event_data.valid[cond_1][j] < this.current_data.epoch

							if(result) break;

						}

					}else if(operator == "in_past_inc"){

						for(var j = 0; j < event_evaluator.event_data.valid[cond_1].length; j++){

							var result = this.current_data.epoch >= event_evaluator.event_data.valid[cond_1][j]-cond_2 && event_evaluator.event_data.valid[cond_1][j] >= this.current_data.epoch

							if(result) break;

						}

					}else if(operator == "in_future_inc"){

						for(var j = 0; j < event_evaluator.event_data.valid[cond_1].length; j++){

							var result = this.current_data.epoch <= event_evaluator.event_data.valid[cond_1][j]+cond_2 && event_evaluator.event_data.valid[cond_1][j] <= this.current_data.epoch

							if(result) break;

						}

					}

				}else{

					var selected = this.current_data[selector];
					var cond_1 = Number(values[subcon[2]]) != NaN ? Number(values[subcon[2]]) : values[subcon[2]];
					var cond_2 = values[subcon[3]] ? values[subcon[3]] : undefined;
					cond_2 = Number(cond_2) != NaN ? Number(cond_2) : cond_2;

				}

				if(array[0] !== "Events"){

					if(operator == '%'){
						var result = evaluate_operator("&&", evaluate_operator(operator, selected, cond_1, cond_2), result)
					}else{
						if(subcon.length == 4){
							var result = evaluate_operator("&&", evaluate_operator(operator, selected, cond_1, cond_2), result)
						}else{
							var result = evaluate_operator("&&", evaluate_operator(operator, selected, cond_1), result)
						}
					}

				}

			}

			return result;
		}

		function evaluate_event_num_group(array, num){

			var result = false;

			var count_result = 0;

			for(var i = array.length-1; i >= 0; i-=1){

				var condition = array[i];

				var is_array = Array.isArray(condition[1]);

				if(is_array){

					var is_count = Number(condition[0]) != NaN;

					if(is_count){

						var new_result = evaluate_event_num_group(condition[1], Number(condition[0]));

					}else{

						var new_result = evaluate_event_group(condition[1]);

						new_result = condition[0] === "!" ? !new_result : new_result;

					}

				}else{

					var new_result = evaluate_condition(condition);

				}

				count_result = new_result ? count_result+1 : count_result;

				result = count_result >= num;

				if(result) return true;

			}

			return false;

		}

		function evaluate_event_group(array){

			var result = false;

			for(var i = array.length-1; i >= 0; i-=2){

				var condition = array[i];

				var is_array = Array.isArray(condition[1]);

				if(is_array){

					var is_count = condition[0] !== "" && condition[0] !== "!" && Number(condition[0]) !== NaN;

					if(is_count){

						var new_result = evaluate_event_num_group(condition[1], Number(condition[0]));

					}else{

						var new_result = evaluate_event_group(condition[1]);

						new_result = condition[0] === "!" ? !new_result : new_result;

					}

				}else{

					var new_result = evaluate_condition(condition);

				}

				if(array[i+1]){
					
					result = evaluate_operator(array[i+1][0], result, new_result); 

				}else{

					result = new_result;

				}

			}

			return result;

		}

		function evaluate_event(event_index){

			this.current_event = event_evaluator.events[event_index];

			if(this.current_event.data.date !== undefined && this.current_event.data.date.length === 3){

				var epoch = evaluate_calendar_start(event_evaluator.static_data, convert_year(event_evaluator.static_data, this.current_event.data.date[0]), this.current_event.data.date[1], this.current_event.data.date[2]).epoch;

				if(epoch_list[Object.keys(epoch_list)[0]].year == this.current_event.data.date[0]){

					add_to_epoch(this.current_event, event_index, epoch);

				}

			}else{

				var num_epochs = Object.keys(epoch_list).length;

				for(var epoch_index = 0; epoch_index < num_epochs; epoch_index++){

					var epoch = parseInt(Object.keys(epoch_list)[epoch_index]);

					if(event_evaluator.callback){

						postMessage({
							count: [
								event_evaluator.number_of_epochs,
								num_epochs*event_evaluator.number_of_events
							],
							callback: true
						})

						event_evaluator.number_of_epochs++;

					}

					add_event = true
					if(this.current_event.data.limited_repeat){
						for(var i = 1; i <= this.current_event.data.limited_repeat_num; i++){
							if(event_evaluator.event_data.valid[event_index] && event_evaluator.event_data.valid[event_index].includes(epoch-i)){
								add_event = false
								epoch_index += this.current_event.data.limited_repeat_num-1;
								event_evaluator.number_of_epochs += this.current_event.data.limited_repeat_num-1;
								break;
							}
						}
					}

					this.current_data = epoch_list[epoch];

					if(add_event){

						var result = evaluate_event_group(this.current_event.data.conditions);

						if(result){
								
							add_to_epoch(this.current_event, event_index, epoch);

						}

					}

				}

			}

		}

		function add_to_epoch(event, event_index, epoch){

			if(!event_evaluator.event_data.valid[event_index]){
				event_evaluator.event_data.valid[event_index] = [];
				event_evaluator.event_data.starts[event_index] = [];
				event_evaluator.event_data.ends[event_index] = [];
			}

			if(event.data.has_duration){

				if(event_evaluator.event_data.valid[event_index].indexOf(epoch) == -1 && epoch >= event_evaluator.start_epoch) {
					event_evaluator.event_data.valid[event_index].push(epoch);
					event_evaluator.event_data.starts[event_index].push(epoch);
				}

				if(!event.data.show_first_last){

					for(var duration = 1; duration < event.data.duration; duration++)
					{
						if(event_evaluator.event_data.valid[event_index].indexOf(epoch+duration-1) == -1 && epoch+duration >= event_evaluator.start_epoch) {
							event_evaluator.event_data.valid[event_index].push(epoch+duration-1);
						}
					}
				}

				if(event_evaluator.event_data.valid[event_index].indexOf(epoch+event.data.duration-1) == -1 && epoch+event.data.duration-1 >= event_evaluator.start_epoch) {
					event_evaluator.event_data.valid[event_index].push(epoch+event.data.duration-1);
					event_evaluator.event_data.ends[event_index].push(epoch+event.data.duration-1);
				}

			}else{

				if(epoch >= event_evaluator.start_epoch && event_evaluator.event_data.valid[event_index].indexOf(epoch) == -1){
					event_evaluator.event_data.valid[event_index].push(epoch);
				}

			}

		}

		function check_event_chain(id){

			var current_event = event_evaluator.events[id];

			if(current_event.data.connected_events !== undefined && current_event.data.connected_events !== "false"){

				for(var connectedId in current_event.data.connected_events){

					var parent_id = current_event.data.connected_events[connectedId];
						
					check_event_chain(parent_id);

				}

			}

			if(event_evaluator.event_data.valid[id] === undefined){

				evaluate_event(id);

			}

		}

		function get_number_of_events(id){

			var current_event = event_evaluator.events[id];

			if(current_event.data.connected_events !== undefined && current_event.data.connected_events !== "false"){

				for(var connectedId in current_event.data.connected_events){

					var parent_id = current_event.data.connected_events[connectedId];
						
					get_number_of_events(parent_id);

					event_evaluator.number_of_events++;

				}

			}

		}

		if(event_id !== undefined){

			if(event_evaluator.callback !== undefined){

				event_evaluator.number_of_events = 1;
				event_evaluator.number_of_epochs = 1;

				get_number_of_events(event_id);

			}

			if(this.events[event_id].data.connected_events !== undefined && this.events[event_id].data.connected_events.length > 0){
				check_event_chain(event_id);
			}

			if(this.events[event_id].data.connected_events === undefined || this.events[event_id].data.connected_events.length == 0){
				evaluate_event(event_id);
			}

		}else{

			for(var event_index in this.events){
				if(this.events[event_index].data.connected_events !== undefined && this.events[event_index].data.connected_events.length > 0){
					check_event_chain(event_index);
				}
			}

			for(var event_index in this.events){
				if(this.events[event_index].data.connected_events === undefined || this.events[event_index].data.connected_events.length == 0){
					evaluate_event(event_index);
				}
			}

		}

	}

};