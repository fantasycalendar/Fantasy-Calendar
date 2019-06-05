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

		function evaluate_condition(array, data){

			data_value = []

			var category = array[0];
			var type = array[1];
			var values = array[1];

			var result = true;
			
			for(var i = 0; i < condition_mapping[category][type][1].length; i++){
				var subcon = condition_mapping[category][type][1][i];
				var selector = subcon[0];
				var operator = subcon[1];

				if(operator == '%'){
					var result = evaluate_operator("&&", evaluate_operator(operator, data[selector], array[2][subcon[2]], array[2][subcon[3]]), result)
				}else{
					if(subcon.length == 4){
						var result = evaluate_operator("&&", evaluate_operator(operator, data[selector][array[2][subcon[2]]], array[2][subcon[3]]), result)
					}else{
						var result = evaluate_operator("&&", evaluate_operator(operator, data[selector], array[2][subcon[2]]), result)
					}
				}

			}
			return result;
		}

		function evaluate_event_conditions(array, data, num){
			var result = undefined;
			var num_result = 0;
			var decrement = num ? 1 : 2;
			for(var i = array.length-1; i >= 0; i-=decrement){
				var condition = array[i];
				if(Array.isArray(condition[1])){
					if(Number(condition[0]) !== NaN){
						var result = evaluate_event_conditions(condition[1], data, Number(condition[0]));
					}else{
						var result = evaluate_event_conditions(condition[1], data);
						if(condition[0] == "!"){
							result = !result;
						}
					}

				}else{
					if(num !== undefined){
						var test = evaluate_condition(condition, data);
						if(test){
							num_result++;
						}
						if(i == 0){
							var result = num_result >= num;
						}
					}else{
						if(i != array.length-1){
							condition_operator = array[i+1][0];
							var result = evaluate_operator(condition_operator, evaluate_condition(condition, data), result);
						}else{
							var result = evaluate_condition(condition, data);
						}
					}
				}

			}
			return result;
		}

		function evaluate_event(event_index){

			var current_event = event_evaluator.events[event_index];

			var num_epochs = Object.keys(epoch_list).length;

			for(var epoch_index = 0; epoch_index < num_epochs; epoch_index++){

				var epoch = parseInt(Object.keys(epoch_list)[epoch_index]);

				var current_epoch_data = epoch_list[epoch];

				var result = evaluate_event_conditions(current_event.data.conditions, current_epoch_data);

				if(result){
						
					if(!event_evaluator.event_data.valid[event_index]){
						event_evaluator.event_data.valid[event_index] = [];
						event_evaluator.event_data.starts[event_index] = [];
						event_evaluator.event_data.ends[event_index] = [];
					}

					if(current_event.data.length > 1){

						if(event_evaluator.event_data.valid[event_index].indexOf(epoch) == -1 && epoch >= event_evaluator.start_epoch) {
							event_evaluator.event_data.valid[event_index].push(epoch);
							event_evaluator.event_data.starts[event_index].push(epoch);
						}

						if(!current_event.data.show_first_last){

							for(var length = 1; length < current_event.data.length; length++)
							{
								if(event_evaluator.event_data.valid[event_index].indexOf(epoch+length) == -1 && epoch+length >= event_evaluator.start_epoch) {
									event_evaluator.event_data.valid[event_index].push(epoch+length);
								}
							}
						}

						if(event_evaluator.event_data.valid[event_index].indexOf(epoch+current_event.data.length) == -1 && epoch+current_event.data.length >= event_evaluator.start_epoch) {
							event_evaluator.event_data.valid[event_index].push(epoch+current_event.data.length);
							event_evaluator.event_data.ends[event_index].push(epoch+current_event.data.length);
						}

					}else{

						if(epoch >= event_evaluator.start_epoch){
							event_evaluator.event_data.valid[event_index].push(epoch);
						}

					}

				}

			}
		}


		if(event_id !== undefined){

			evaluate_event(this.events[event_id])

		}else{

			var num_events = this.events.length;

			for(var event_index = 0; event_index < num_events; event_index++){

				evaluate_event(event_index);

			}

		}

	}

};