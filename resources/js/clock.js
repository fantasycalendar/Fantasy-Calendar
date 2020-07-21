class Clock{

	constructor(
		clock_face_canvas,
		clock_sun_canvas,
		clock_background_canvas,
		size,
		hours,
		minutes,
		offset,
		crowding,
		hour,
		minute,
		has_sun,
		sunrise,
		sunset
	){

		this.clock_face_canvas = clock_face_canvas;
		this.clock_sun_canvas = clock_sun_canvas;
		this.clock_background_canvas = clock_background_canvas;

		this._size = size;

		this.clock_face_canvas.width = this.size;
		this.clock_face_canvas.height = this.size;
		this.clock_sun_canvas.width = this.size;
		this.clock_sun_canvas.height = this.size;
		this.clock_background_canvas.width = this.size;
		this.clock_background_canvas.height = this.size;

		this.face_ctx = this.clock_face_canvas.getContext("2d");
		this.sun_ctx = this.clock_sun_canvas.getContext("2d");
		this.bg_ctx = this.clock_background_canvas.getContext("2d");

		this.width = this.clock_background_canvas.width;
		this.outer_radius = this.width / 2;

		this.radius = this.outer_radius * 0.90

		this._hours = hours;
		this._minutes = minutes;
		this._offset = offset;
		this._crowding = crowding+1;
		this._hour = hour;
		this._minute = minute;
		this._has_sun = has_sun;

		this._sunrise = sunrise;
		var time = this.sunrise%this.hours;
		time = time > this.hours ? time - this.hours : time;
		time = (360/this.hours)*((time-Math.floor(this.hours/2)+this.offset));
		this._sunrise_degree = time;

		this._sunset = sunset;
		var time = this.sunset;
		time = (360/this.hours)*((time-Math.floor(this.hours/2)+this.offset));
		this._sunset_degree = time;

		var time = this.hour + (this.minute/this.minutes);
		this._current_time_degrees = this.degrees_from_time(time)


		this.pointer_thickness_tip = 0.75
		this.pointer_thickness_base = 2.5
		this.pointer_length = 7.7

		this.dark_color = "#4c51bf";
		this.mid_color = "#725496";
		this.mid_secondary_color = "#362847";
		this.light_color = "#f6e05e";

		this.face_font_color = 'black';
		this.face_font_size = 6;
		this.face_font_stroke = false;
		this.face_font_stroke_color = 'black';
		this.face_font_stroke_size = 5;

		this.draw()

	}

	get size(){

		return this._size;

	}

	set size(size){

		if(this._size != size){

			this._size = size;

			this.clock_face_canvas.width = this.size;
			this.clock_face_canvas.height = this.size;
			this.clock_sun_canvas.width = this.size;
			this.clock_sun_canvas.height = this.size;
			this.clock_background_canvas.width = this.size;
			this.clock_background_canvas.height = this.size;

			this.width = this.clock_background_canvas.width;
			this.outer_radius = this.width / 2;

			this.radius = this.outer_radius * 0.90

			this.draw();

		}

	}


	draw(){

		this.clear()
		if(this._has_sun){
			this.draw_sunsrise_sunset()
		}
		this.draw_background()
		this.draw_border()
		this.draw_numbers()
		this.draw_pointer()

	}

	clear(){

		// Use the identity matrix while clearing the canvas
		this.bg_ctx.setTransform(1, 0, 0, 1, 0, 0);
		this.bg_ctx.clearRect(0, 0, this.clock_face_canvas.width, this.clock_face_canvas.height);
		this.bg_ctx.translate(this.outer_radius, this.outer_radius);

		this.sun_ctx.setTransform(1, 0, 0, 1, 0, 0);
		this.sun_ctx.clearRect(0, 0, this.clock_face_canvas.width, this.clock_face_canvas.height);
		this.sun_ctx.translate(this.outer_radius, this.outer_radius);

		this.face_ctx.setTransform(1, 0, 0, 1, 0, 0);
		this.face_ctx.clearRect(0, 0, this.clock_face_canvas.width, this.clock_face_canvas.height);
		this.face_ctx.translate(this.outer_radius, this.outer_radius);

	}

	draw_background(){

		this.bg_ctx.beginPath();
		this.bg_ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
		this.bg_ctx.globalCompositeOperation = "destination-over";
		this.bg_ctx.fillStyle = this.light_color;
		this.bg_ctx.fill();

	}

	draw_sunsrise_sunset(){

		if(this.sunset_degree-this.sunrise_degree <= 0){
			var sunset_degree = 0;
			var sunrise_degree = 0;
		}else if(this.sunset_degree-this.sunrise_degree >= 360){
			var sunset_degree = 180;
			var sunrise_degree = -180;
		}else{
			var sunset_degree = this.sunset_degree;
			var sunrise_degree = this.sunrise_degree;
		}

		this.sun_ctx.beginPath();
		this.sun_ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
		this.sun_ctx.fillStyle = this.dark_color;
		this.sun_ctx.clip();
		this.sun_ctx.closePath();

		this.sun_ctx.beginPath();
		this.sun_ctx.globalCompositeOperation = "source-over";

		this.sun_ctx.filter = "blur(10px)";

		this.sun_ctx.moveTo(0, 0)

		this.sun_ctx.lineTo(this.degrees_to_x(sunrise_degree), this.degrees_to_y(sunrise_degree));

		for(var i = sunrise_degree; i > sunset_degree-360; i-=15){
			this.sun_ctx.lineTo(this.degrees_to_x(i)*1.5, this.degrees_to_y(i)*1.5);
		}

		this.sun_ctx.lineTo(this.degrees_to_x(sunset_degree), this.degrees_to_y(sunset_degree));

		this.sun_ctx.lineTo(0, 0)

		this.sun_ctx.fillStyle = this.dark_color;
		this.sun_ctx.fill();
		this.sun_ctx.closePath();

		this.sun_ctx.globalCompositeOperation = "source-over";

		this.sun_ctx.beginPath();
		this.sun_ctx.moveTo(0,0)
		this.sun_ctx.lineTo(this.degrees_to_x(sunrise_degree+8)*1.5, this.degrees_to_y(sunrise_degree+8)*1.5);
		this.sun_ctx.lineTo(this.degrees_to_x(sunrise_degree-8)*1.5, this.degrees_to_y(sunrise_degree-8)*1.5);
		this.sun_ctx.lineTo(0,0)
		this.sun_ctx.lineTo(this.degrees_to_x(sunset_degree+8)*1.5, this.degrees_to_y(sunset_degree+8)*1.5);
		this.sun_ctx.lineTo(this.degrees_to_x(sunset_degree-8)*1.5, this.degrees_to_y(sunset_degree-8)*1.5);
		this.sun_ctx.fillStyle = this.mid_color;
		this.sun_ctx.fill();
		this.sun_ctx.closePath();

		this.sun_ctx.filter = "blur(5px)";

		this.sun_ctx.beginPath();
		this.sun_ctx.moveTo(this.degrees_to_x(sunrise_degree)*1.5, this.degrees_to_y(sunrise_degree)*1.5);
		this.sun_ctx.lineTo(0,0)
		this.sun_ctx.lineTo(this.degrees_to_x(sunset_degree)*1.5, this.degrees_to_y(sunset_degree)*1.5);
		this.sun_ctx.strokeStyle = this.mid_secondary_color;
		this.sun_ctx.lineWidth = this.radius*0.01;
		this.sun_ctx.lineJoin = 'miter';
		this.sun_ctx.miterLimit = 1;
		this.sun_ctx.stroke();
		this.sun_ctx.closePath();

	}

	draw_border(){

		this.face_ctx.beginPath();
		this.face_ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
		this.face_ctx.globalCompositeOperation = "destination-over";
		
		var rim = this.face_ctx.arc(0, 0, this.radius*0.99, 0, 0, this.radius*1.01);
		this.face_ctx.strokeStyle = rim;
		this.face_ctx.lineWidth = this.radius*0.04;
		this.face_ctx.globalCompositeOperation = "source-over";
		this.face_ctx.stroke();
		this.face_ctx.closePath();

	}

	draw_pointer(){

		this.face_ctx.beginPath();
		this.face_ctx.arc(0, 0, this.radius*0.05, 0, 2 * Math.PI);
		this.face_ctx.globalCompositeOperation = "source-over";
		this.face_ctx.fillStyle = 'black';
		this.face_ctx.fill();
		this.face_ctx.closePath();

		this.face_ctx.beginPath();
		this.face_ctx.translate(0,0);
		this.face_ctx.rotate(this.current_time_degrees);
		this.face_ctx.lineTo(this.radius*(this.pointer_thickness_base*0.01), this.radius*(this.pointer_thickness_base*0.01));
		this.face_ctx.lineTo(this.radius*(this.pointer_thickness_tip*0.01), this.radius*-(this.pointer_length*0.1));
		this.face_ctx.lineTo(this.radius*-(this.pointer_thickness_tip*0.01), this.radius*-(this.pointer_length*0.1));
		this.face_ctx.lineTo(this.radius*-(this.pointer_thickness_base*0.01), this.radius*(this.pointer_thickness_base*0.01));
		this.face_ctx.lineTo(0, 0);
		this.face_ctx.fillStyle = 'black';
		this.face_ctx.fill();
		this.face_ctx.closePath();

		this.face_ctx.beginPath();
		this.face_ctx.arc(0, 0, this.radius*0.02, 0, 2 * Math.PI);
		this.face_ctx.globalCompositeOperation = "source-over";
		this.face_ctx.fillStyle = 'white';
		this.face_ctx.fill();
		this.face_ctx.closePath();

	}

	draw_numbers(){

		this.face_ctx.font = this.radius * this.face_font_size*0.001 + "rem arial";
		this.face_ctx.textBaseline = "middle";
		this.face_ctx.textAlign = "center";

		for(var num = 0; num < this.hours; num++){

			var ang = (num+this.hours/2+this.offset) * Math.PI / this.hours*2;

			this.face_ctx.rotate(ang);
			this.face_ctx.translate(0, -this.radius * 0.85);
			this.face_ctx.rotate(-ang);

			if(num%this._crowding == 0){

				if(this.face_font_stroke){

					this.face_ctx.strokeStyle = this.face_font_stroke_color;
					this.face_ctx.lineWidth = this.face_font_stroke_size;

					this.face_ctx.lineJoin = 'miter';
					this.face_ctx.miterLimit = 5;
					this.face_ctx.strokeText(num.toString(), 0, 0);

				}

				this.face_ctx.fillStyle = this.face_font_color;
				this.face_ctx.fillText(num.toString(), 0, 0);

			}

			this.face_ctx.rotate(ang);
			this.face_ctx.translate(0, this.radius * 0.85);
			this.face_ctx.translate(0, -this.radius * 0.88);

			this.face_ctx.beginPath();
			this.face_ctx.moveTo(-this.clock_face_canvas.width*0.005, -this.clock_face_canvas.width*0.03);
			this.face_ctx.lineTo(-this.clock_face_canvas.width*0.005, -this.clock_face_canvas.width*0.05);
			this.face_ctx.lineTo(this.clock_face_canvas.width*0.005, -this.clock_face_canvas.width*0.05);
			this.face_ctx.lineTo(this.clock_face_canvas.width*0.005, -this.clock_face_canvas.width*0.03);
			this.face_ctx.fillStyle = 'black';
			this.face_ctx.fill();

			this.face_ctx.translate(0, this.radius * 0.88);
			this.face_ctx.rotate(-ang);

		}

		this.face_ctx.closePath();

	}

	set hours(inhours){
		this._hours = hours;
		this.update_current_time()
	}

	get hours(){
		return this._hours;
	}


	set minutes(inminutes){
		this._minutes = minutes;
		this.update_current_time()
	}

	get minutes(){
		return this._minutes;
	}


	set offset(inoffset){
		this._offset = offset;
		this.update_current_time()
	}

	get offset(){
		return this._offset;
	}


	set hour(inhour){
		this._hour = inhour
		this.update_current_time()
	}

	get hour(){
		return this._hour
	}


	set minute(inminute){
		this._minute = inminute
		this.update_current_time()
	}

	get minute(){
		return this._minute
	}


	set sunrise(insunrise){
		this._sunrise = insunrise
		var time = this.sunrise%this.hours;
		time = time > this.hours ? time - this.hours : time;
		time = (360/this.hours)*((time-Math.floor(this.hours/2)+this.offset));
		this._sunrise_degree = time;
		this.draw()
	}

	get sunrise(){
		return this._sunrise
	}

	get sunrise_degree(){
		return this._sunrise_degree
	}


	set sunset(insunset){
		this._sunset = insunset
		var time = this.sunset;
		time = (360/this.hours)*((time-Math.floor(this.hours/2)+this.offset));
		this._sunset_degree = time;
		this.draw()
	}

	get sunset(){
		return this._sunset
	}

	get sunset_degree(){
		return this._sunset_degree
	}

	set_time(hour, minute){
		this._hour = hour
		this._minute = minute
		this.update_current_time()
	}

	update_current_time(){
		var time = this.hour + (this.minute/this.minutes);
		this._current_time_degrees = this.degrees_from_time(time)
		this.draw()
	}

	get current_time_degrees(){
		return this.degree_to_radians(this._current_time_degrees);
	}


	degrees_from_time(time){
		var time = (time+Math.floor(this.offset))%this.hours;
		time = (360/this.hours)*(time-Math.floor(this.hours/2));
		return time;
	}

	degree_to_radians(degree){
		return degree * Math.PI/180;
	}

	degrees_to_x(degree){
		var degree = (degree+270)%360;
		if(degree < -180) degree += 360
		return this.radius * Math.cos(this.degree_to_radians(degree))
	}

	degrees_to_y(degree){
		var degree = (degree+270)%360;
		if(degree < -180) degree += 360
		return this.radius * Math.sin(this.degree_to_radians(degree))
	}

}

module.exports = Clock;