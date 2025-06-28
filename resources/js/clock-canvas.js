class ClockCanvas {

	pointer_thickness_tip = 0.72;
	pointer_thickness_base = 2.5;
	pointer_length = 7.8;

	face_font_size = 7;
	face_font_stroke = false;
	face_font_stroke_size = 5;

	lightColors = {
		dark: tailwindColors.slate[700],
		mid: tailwindColors.purple[500],
		mid_secondary: tailwindColors.purple[400],
		light: tailwindColors.yellow[200],
		text: tailwindColors.gray[900],
		text_light: tailwindColors.violet[100],
		pointer: tailwindColors.gray[800],
		pointer_light: tailwindColors.gray[600],
		center: "white",
		bezel: tailwindColors.slate[600],
	};

	darkColors = {
		dark: tailwindColors.slate[900],
		mid: tailwindColors.violet[600],
		mid_secondary: tailwindColors.fuchsia[600],
		light: tailwindColors.yellow[200],
		text: tailwindColors.gray[900],
		text_light: tailwindColors.violet[100],
		pointer: tailwindColors.gray[800],
		pointer_light: tailwindColors.gray[600],
		center: "white",
		bezel: tailwindColors.slate[700],
	};

	name = "";

	constructor(name) {
		this.name = name;
	}

	load(){
		if(!this.visible) {
			return;
		}
		this.$nextTick(() => {
			this.updateSize();
		});
	}

	get visible() {
		return this.$store.calendar.static_data.clock.enabled && this.$store.calendar.static_data.clock.render;
	}

	get preview_date() {
		return this.$store.calendar.preview_date;
	}

	get clock_settings() {
		return this.$store.calendar.static_data.clock;
	}

	get current_time() {
		return {
			hour: this.$store.calendar.dynamic_data.hour,
			minute: this.$store.calendar.dynamic_data.minute
		}
	}

    get current_time_degrees() {
        let time = this.hour + this.minute / this.minutes;
        return this.degree_to_radians(this.degrees_from_time(time));
    }

	get clock_face_canvas() {
		return this.$refs.clock_face;
	}

	get clock_sun_canvas() {
		return this.$refs.clock_sun;
	}

	get clock_background_canvas() {
		return this.$refs.clock_background;
	}

	get face_ctx() {
		return this.clock_face_canvas.getContext("2d");
	}

	get sun_ctx() {
		return this.clock_sun_canvas.getContext("2d");
	}

	get bg_ctx() {
		return this.clock_background_canvas.getContext("2d");
	}

	get size() {
		return this.clock_face_canvas.parentElement.clientWidth;
	}

	get outer_radius() {
		return this.clock_background_canvas.width / 2;
	}

	get radius() {
		return this.outer_radius * 0.9;
	}

	get hours() {
		return this.clock_settings.hours;
	}

	get minutes() {
		return this.clock_settings.minutes;
	}

	get offset() {
		return this.clock_settings.offset;
	}

	get crowding() {
		return this.clock_settings.crowding + 1;
	}

	get hour() {
		return this.current_time.hour;
	}

	get minute() {
		return this.current_time.minute;
	}

	get current_epoch_data() {
		return this.$store.calendar.evaluated_static_data.epoch_data[this.$store.calendar.preview_date.epoch];
	}

	get has_season_data() {
		return this.current_epoch_data?.season.time.sunrise;
	}

	get sunrise() {
		return this.current_epoch_data?.season.time.sunrise.data;
	}

	get sunset() {
		return this.current_epoch_data?.season.time.sunset.data;
	}

	get sunrise_degree() {
		let time = this.sunrise % this.hours;
		time = time > this.hours ? time - this.hours : time;
		return (360 / this.hours) * (time - Math.floor(this.hours / 2) + this.offset);
	}

	get sunset_degree() {
		return (360 / this.hours) * (this.sunset - Math.floor(this.hours / 2) + this.offset);
	}

	updateSize() {
		this.clock_face_canvas.width = this.size;
		this.clock_face_canvas.height = this.size;
		this.clock_sun_canvas.width = this.size;
		this.clock_sun_canvas.height = this.size;
		this.clock_background_canvas.width = this.size;
		this.clock_background_canvas.height = this.size;
		this.draw();
	}

	draw() {
		this.clear();
		if(this.has_season_data) {
			this.draw_sunrise_sunset();
		}
		this.draw_background();
		this.draw_border();
		this.draw_numbers();
		this.draw_pointer();
	}

	clear() {
		// Use the identity matrix while clearing the canvas
		this.bg_ctx.setTransform(1, 0, 0, 1, 0, 0);
		this.bg_ctx.clearRect(
			0,
			0,
			this.clock_face_canvas.width,
			this.clock_face_canvas.height,
		);
		this.bg_ctx.translate(this.outer_radius, this.outer_radius);

		this.sun_ctx.setTransform(1, 0, 0, 1, 0, 0);
		this.sun_ctx.clearRect(
			0,
			0,
			this.clock_face_canvas.width,
			this.clock_face_canvas.height,
		);
		this.sun_ctx.translate(this.outer_radius, this.outer_radius);

		this.face_ctx.setTransform(1, 0, 0, 1, 0, 0);
		this.face_ctx.clearRect(
			0,
			0,
			this.clock_face_canvas.width,
			this.clock_face_canvas.height,
		);
		this.face_ctx.translate(this.outer_radius, this.outer_radius);
	}

	draw_background() {
		this.bg_ctx.beginPath();
		this.bg_ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
		this.bg_ctx.globalCompositeOperation = "destination-over";
		this.bg_ctx.fillStyle = this.color("light");
		this.bg_ctx.fill();
	}

	draw_sunrise_sunset() {
		let sunset_degree;
		let sunrise_degree;
		if (this.sunset_degree - this.sunrise_degree <= 0) {
			sunset_degree = 0;
			sunrise_degree = 0;
		} else if (this.sunset_degree - this.sunrise_degree >= 360) {
			sunset_degree = 180;
			sunrise_degree = -180;
		} else {
			sunset_degree = this.sunset_degree;
			sunrise_degree = this.sunrise_degree;
		}

		this.sun_ctx.beginPath();
		this.sun_ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
		this.sun_ctx.fillStyle = this.color("dark");
		this.sun_ctx.clip();
		this.sun_ctx.closePath();

		this.sun_ctx.beginPath();
		this.sun_ctx.globalCompositeOperation = "source-over";

		this.sun_ctx.filter = "blur(10px)";

		this.sun_ctx.moveTo(0, 0);

		this.sun_ctx.lineTo(
			this.degrees_to_x(sunrise_degree),
			this.degrees_to_y(sunrise_degree),
		);

		for (let i = sunrise_degree; i > sunset_degree - 360; i -= 15) {
			this.sun_ctx.lineTo(
				this.degrees_to_x(i) * 1.5,
				this.degrees_to_y(i) * 1.5,
			);
		}

		this.sun_ctx.lineTo(
			this.degrees_to_x(sunset_degree),
			this.degrees_to_y(sunset_degree),
		);

		this.sun_ctx.lineTo(0, 0);

		this.sun_ctx.fillStyle = this.color("dark");
		this.sun_ctx.fill();
		this.sun_ctx.closePath();

		this.sun_ctx.globalCompositeOperation = "source-over";

		this.sun_ctx.beginPath();
		this.sun_ctx.moveTo(0, 0);
		this.sun_ctx.lineTo(
			this.degrees_to_x(sunrise_degree + 8) * 1.5,
			this.degrees_to_y(sunrise_degree + 8) * 1.5,
		);
		this.sun_ctx.lineTo(
			this.degrees_to_x(sunrise_degree - 8) * 1.5,
			this.degrees_to_y(sunrise_degree - 8) * 1.5,
		);
		this.sun_ctx.lineTo(0, 0);
		this.sun_ctx.lineTo(
			this.degrees_to_x(sunset_degree + 8) * 1.5,
			this.degrees_to_y(sunset_degree + 8) * 1.5,
		);
		this.sun_ctx.lineTo(
			this.degrees_to_x(sunset_degree - 8) * 1.5,
			this.degrees_to_y(sunset_degree - 8) * 1.5,
		);
		this.sun_ctx.fillStyle = this.color("mid");
		this.sun_ctx.fill();
		this.sun_ctx.closePath();

		this.sun_ctx.filter = "blur(5px)";

		this.sun_ctx.beginPath();
		this.sun_ctx.moveTo(
			this.degrees_to_x(sunrise_degree) * 1.5,
			this.degrees_to_y(sunrise_degree) * 1.5,
		);
		this.sun_ctx.lineTo(0, 0);
		this.sun_ctx.lineTo(
			this.degrees_to_x(sunset_degree) * 1.5,
			this.degrees_to_y(sunset_degree) * 1.5,
		);
		this.sun_ctx.strokeStyle = this.color("mid_secondary");
		this.sun_ctx.lineWidth = this.radius * 0.01;
		this.sun_ctx.lineJoin = "miter";
		this.sun_ctx.miterLimit = 1;
		this.sun_ctx.stroke();
		this.sun_ctx.closePath();
	}

	draw_border() {
		this.face_ctx.beginPath();
		this.face_ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
		this.face_ctx.globalCompositeOperation = "destination-over";

		let rim = this.face_ctx.arc(
			0,
			0,
			this.radius * 0.99,
			0,
			0,
			this.radius * 1.01,
		);
		this.face_ctx.strokeStyle = rim;
		this.face_ctx.lineWidth = this.radius * 0.04;
		this.face_ctx.globalCompositeOperation = "source-over";
		this.face_ctx.strokeStyle = this.color("bezel");
		this.face_ctx.stroke();
		this.face_ctx.closePath();
	}

	draw_pointer() {
		this.face_ctx.beginPath();
		this.face_ctx.arc(0, 0, this.radius * 0.05, 0, 2 * Math.PI);
		this.face_ctx.globalCompositeOperation = "source-over";
		this.face_ctx.fillStyle =
			this.hour > this.sunrise && this.hour + 1 <= this.sunset
				? this.color("pointer")
				: this.color("pointer_light");
		this.face_ctx.fill();
		this.face_ctx.closePath();

		this.face_ctx.beginPath();
		this.face_ctx.translate(0, 0);
		this.face_ctx.rotate(this.current_time_degrees);
		this.face_ctx.lineTo(
			this.radius * (this.pointer_thickness_base * 0.01),
			this.radius * (this.pointer_thickness_base * 0.01),
		);
		this.face_ctx.lineTo(
			this.radius * (this.pointer_thickness_tip * 0.01),
			this.radius * -(this.pointer_length * 0.1),
		);
		this.face_ctx.lineTo(
			this.radius * -(this.pointer_thickness_tip * 0.01),
			this.radius * -(this.pointer_length * 0.1),
		);
		this.face_ctx.lineTo(
			this.radius * -(this.pointer_thickness_base * 0.01),
			this.radius * (this.pointer_thickness_base * 0.01),
		);
		this.face_ctx.lineTo(0, 0);
		this.face_ctx.fillStyle =
			this.hour > this.sunrise && this.hour + 1 <= this.sunset
				? this.color("pointer")
				: this.color("pointer_light");
		this.face_ctx.fill();
		this.face_ctx.closePath();

		this.face_ctx.beginPath();
		this.face_ctx.arc(0, 0, this.radius * 0.02, 0, 2 * Math.PI);
		this.face_ctx.globalCompositeOperation = "source-over";
		this.face_ctx.fillStyle = this.color("center");
		this.face_ctx.fill();
		this.face_ctx.closePath();
	}

	draw_numbers() {
		this.face_ctx.font = this.radius * this.face_font_size * 0.001 + "rem arial";
		this.face_ctx.textBaseline = "middle";
		this.face_ctx.textAlign = "center";

		let face_distance_percent = 0.86;

		for (let num = 0; num < this.hours; num++) {
			let ang =
				(((num + this.hours / 2 + this.offset) * Math.PI) /
					this.hours) *
				2;

			this.face_ctx.rotate(ang);
			this.face_ctx.translate(0, -this.radius * face_distance_percent);
			this.face_ctx.rotate(-ang);

			if (num % this.crowding === 0) {
				if (this.face_font_stroke) {
					this.face_ctx.strokeStyle = !this.has_season_data || (num + 0.5 > Math.round(this.sunrise) && num - 0.5 <= Math.round(this.sunset))
							? this.color("text")
							: this.color("text_light");
					this.face_ctx.lineWidth = this.face_font_stroke_size;

					this.face_ctx.lineJoin = "miter";
					this.face_ctx.miterLimit = 5;
					this.face_ctx.strokeText(num.toString(), 0, 0);
				}

				this.face_ctx.fillStyle = !this.has_season_data || (num + 0.5 > Math.round(this.sunrise) && num - 0.5 <= Math.round(this.sunset))
						? this.color("text")
						: this.color("text_light");
				this.face_ctx.fillText(num.toString(), 0, 0);
			}

			this.face_ctx.rotate(ang);
			this.face_ctx.translate(0, this.radius * face_distance_percent);
			this.face_ctx.translate(0, -this.radius * 0.88);

			// Assuming we're drawing at the bottom of the clock, the pips are drawn:
			this.face_ctx.beginPath();

			let topWidth = 6;
			let bottomWidth = 10;
			let topDistanceFromLetter = 28;
			let bottomDistanceFromLetter = 50;

			let points = [
				[-(topWidth / 2), -topDistanceFromLetter], // Top-right
				[-(bottomWidth / 2), -bottomDistanceFromLetter], // Bottom-right
				[bottomWidth / 2, -bottomDistanceFromLetter], // Bottom-left
				[topWidth / 2, -topDistanceFromLetter], // Top-left
			];

			this.face_ctx.moveTo(
				this.clock_face_canvas.width * (points[0][0] / 1000),
				this.clock_face_canvas.width * (points[0][1] / 1000),
			);
			this.face_ctx.lineTo(
				this.clock_face_canvas.width * (points[1][0] / 1000),
				this.clock_face_canvas.width * (points[1][1] / 1000),
			);
			this.face_ctx.lineTo(
				this.clock_face_canvas.width * (points[2][0] / 1000),
				this.clock_face_canvas.width * (points[2][1] / 1000),
			);
			this.face_ctx.lineTo(
				this.clock_face_canvas.width * (points[3][0] / 1000),
				this.clock_face_canvas.width * (points[3][1] / 1000),
			);
			this.face_ctx.fillStyle = this.color("bezel");
			this.face_ctx.fill();

			this.face_ctx.translate(0, this.radius * 0.88);
			this.face_ctx.rotate(-ang);
		}

		this.face_ctx.closePath();
	}

	degrees_from_time(time) {
		let normalizedTime = (time + Math.floor(this.offset)) % this.hours;
		normalizedTime = (360 / this.hours) * (normalizedTime - Math.floor(this.hours / 2));
		return normalizedTime;
	}

	degree_to_radians(degree) {
		return (degree * Math.PI) / 180;
	}

	degrees_to_x(degree) {
		let normalizedDegree = (degree + 270) % 360;
		if (normalizedDegree < -180) normalizedDegree += 360;
		return this.radius * Math.cos(this.degree_to_radians(normalizedDegree));
	}

	degrees_to_y(degree) {
		let normalizedDegree = (degree + 270) % 360;
		if (normalizedDegree < -180) normalizedDegree += 360;
		return this.radius * Math.sin(this.degree_to_radians(normalizedDegree));
	}

	color(colorName) {
		return (
			(window.dark_theme ? this.darkColors : this.lightColors)[colorName] ?? "white"
		);
	}
}

export default (name) => new ClockCanvas(name);
