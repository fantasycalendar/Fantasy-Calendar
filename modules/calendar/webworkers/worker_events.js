importScripts('../js/calendar_functions.js');
importScripts('../js/calendar_variables.js');


onmessage = e => {
	data = event_evaluator.init(e.data.static_data, e.data.pre_epoch_data, e.data.epoch_data, e.data.event_id);
	postMessage(data);
}

var event_evaluator = {

	events: [],
	categories: [],

	start_epoch: 0,

	static_data: {},
	pre_epoch_data: {},
	epoch_data: {},

	current_data: {},

	init: function(static_data, pre_epoch_data, epoch_data, event_id){

		this.static_data = static_data;
		this.pre_epoch_data = pre_epoch_data;
		this.epoch_data = epoch_data;

		if(event_id !== undefined){

			this.event_data.valid[event_id] = [];
			this.event_data.starts[event_id] = [];
			this.event_data.ends[event_id] = [];

		}else{

			this.event_data = {
				valid: {},
				starts: {},
				ends: {},
			}

		}

		this.events_only_happen_once = [];

		this.start_epoch = Number(Object.keys(this.epoch_data)[0]);

		this.events = clone(this.static_data.event_data.events);
		this.categories = clone(this.static_data.event_data.categories);
		this.evaluate_valid_events(this.pre_epoch_data, event_id);
		this.evaluate_valid_events(this.epoch_data, event_id);

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

			if(event_evaluator.events_only_happen_once.indexOf(event_index) != -1){
				return;
			}

			this.current_event = event_evaluator.events[event_index];

			var num_epochs = Object.keys(epoch_list).length;

			for(var epoch_index = 0; epoch_index < num_epochs; epoch_index++){

				var epoch = parseInt(Object.keys(epoch_list)[epoch_index]);

				this.current_data = epoch_list[epoch];

				var result = evaluate_event_group(this.current_event.data.conditions);

				if(result){
						
					if(!event_evaluator.event_data.valid[event_index]){
						event_evaluator.event_data.valid[event_index] = [];
						event_evaluator.event_data.starts[event_index] = [];
						event_evaluator.event_data.ends[event_index] = [];
					}

					if(this.current_event.data.has_duration){

						if(event_evaluator.event_data.valid[event_index].indexOf(epoch) == -1 && epoch >= event_evaluator.start_epoch) {
							event_evaluator.event_data.valid[event_index].push(epoch);
							event_evaluator.event_data.starts[event_index].push(epoch);
						}

						if(!this.current_event.data.show_first_last){

							for(var duration = 1; duration < this.current_event.data.duration; duration++)
							{
								if(event_evaluator.event_data.valid[event_index].indexOf(epoch+duration) == -1 && epoch+duration >= event_evaluator.start_epoch) {
									event_evaluator.event_data.valid[event_index].push(epoch+duration);
								}
							}
						}

						if(event_evaluator.event_data.valid[event_index].indexOf(epoch+this.current_event.data.duration) == -1 && epoch+this.current_event.data.duration >= event_evaluator.start_epoch) {
							event_evaluator.event_data.valid[event_index].push(epoch+this.current_event.data.duration);
							event_evaluator.event_data.ends[event_index].push(epoch+this.current_event.data.duration);
						}

					}else{

						if(epoch >= event_evaluator.start_epoch){
							event_evaluator.event_data.valid[event_index].push(epoch);
						}

					}

					if(this.current_event.data.only_happen_once){
						event_evaluator.events_only_happen_once.push(event_index);
						break;
					}

				}

			}

		}

		if(event_id !== undefined){

			evaluate_event(this.events[event_id])

		}else{

			var num_events = this.events.length;

			for(var event_index = 0; event_index < num_events; event_index++){
				if(this.events[event_index].data.connected_events === undefined || this.events[event_index].data.connected_events.length == 0){
					evaluate_event(event_index);
				}
			}

			execution_time.start();

			for(var event_index = 0; event_index < num_events; event_index++){
				if(this.events[event_index].data.connected_events !== undefined && this.events[event_index].data.connected_events.length > 0){
					check_event_chain(event_index);
				}
			}

			execution_time.end();
		}

		function check_event_chain(id){

			var current_event = event_evaluator.events[id];

			if(current_event.data.connected_events !== undefined){

				for(var i = 0; i < current_event.data.connected_events.length; i++){

					var parent_id = current_event.data.connected_events[i];
						
					check_event_chain(parent_id);

				}

			}

			if(event_evaluator.event_data.valid[id] === undefined){

				evaluate_event(id);

			}

		}

	}

};