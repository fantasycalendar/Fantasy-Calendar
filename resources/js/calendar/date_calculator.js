export default class DateCalculator {
    constructor(calendar, year, month, day) {
        this._year = convert_year(window.static_data, year);

        this._month = month;
        this._day = day;

        this._max_year = false;
        this._max_month = false;
        this._max_day = false;

        this.months_in_year = get_months_in_year(window.static_data, this.year, true);
    }

    compare(data) {
        var rebuild = data.year != this.adjusted_year || (window.static_data.settings.show_current_month && data.month != this.month);

        return {
            year: this.adjusted_year,
            month: this.month,
            day: this.day,
            epoch: this.epoch,
            rebuild: rebuild
        }
    }

    get epoch() {
        return evaluate_calendar_start(window.static_data, this.year, this.month, this.day).epoch;
    }

    get adjusted_year() {

        return unconvert_year(window.static_data, this.year);

    }

    set max_year(year) {
        this._max_year = convert_year(window.static_data, year);
    }

    get max_year() {
        return this._max_year;
    }

    check_max_year(year) {

        if (this.max_year === false) {
            return true;
        }

        return this.max_year >= year;
    }

    set max_month(month) {
        this._max_month = month;
    }

    get max_month() {
        return this._max_month;
    }

    check_max_month(month) {

        if (this.max_month === false) {
            return true;
        }

        if (this.max_year > this.year) {
            return true;
        }

        return this.max_month >= month;
    }

    set max_day(day) {
        this._max_day = day;
    }

    get max_day() {
        return this._max_day;
    }

    check_max_day(day) {

        if (this.max_day === false) {
            return true;
        }

        if (this.max_year > this.year || (this.max_year == this.year && this.max_month > this.month)) {
            return true;
        }

        return this.max_day >= day;
    }

    get last_valid_year() {

        if (this.max_year) {
            return unconvert_year(window.static_data, this.max_year);
        } else {
            return false;
        }

    }

    get last_valid_month() {

        if (this.max_year > this.year) {
            return Infinity;
        } else {
            return this.max_month;
        }

    }

    get last_valid_day() {

        if (this.max_year > this.year || (this.max_year == this.year && this.max_month > this.month)) {
            return Infinity;
        } else {
            return this.max_day;
        }

    }

    get year() {
        return this._year;
    }

    set year(year) {

        if (year === undefined) return;

        if (this.year == year || !this.check_max_year(year)) return;

        if (get_months_in_year(window.static_data, year, false).length != 0) {
            this._year = year;
            this.months_in_year = get_months_in_year(window.static_data, this.year, true);
            this.cap_month();
        } else {
            if (year < this.year) {
                this.year = year - 1;
            } else if (year > this.year) {
                this.year = year + 1;
            }
        }

    }

    cap_month() {

        if (this.month >= this.months_in_year.length) {
            this.month = this.last_month.length - 1;
        }

        if (!this.months_in_year[this.month].result || this.day > this.num_days) {
            this.month = this.last_month;
            this.day = this.num_days;
        }

    }

    get last_month() {

        for (var i = this.months_in_year.length - 1; i >= 0; i--) {
            if (this.months_in_year[i].result) {
                return this.months_in_year[i].id
            }
        }

    }

    get first_month() {

        for (var i = 0; i < this.months_in_year.length - 1; i++) {
            if (this.months_in_year[i].result) {
                return this.months_in_year[i].id
            }
        }

    }

    set month(month) {

        if (month === undefined) return;

        if (!this.check_max_month(month)) return;

        if (month < 0) {

            this.subtract_year();
            this.month = this.last_month;

        } else if (month > this.last_month) {

            this.add_year();
            this.month = this.first_month;

        } else if (!this.months_in_year[month].result) {

            if (month > this._month) {
                this.month = month + 1;
            } else if (month < this._month) {
                this.month = month - 1;
            }

        } else {
            this._month = month;
            this.cap_day();
        }

    }

    get month() {
        return this._month;
    }


    cap_day() {
        if (!this.check_max_day(this.day)) {
            this.day = this.max_day;
        } else if (this.day > this.num_days) {
            this.day = this.num_days;
        }
    }

    get num_days() {
        return get_days_in_month(window.static_data, this.year, this.month).length;
    }

    get day() {
        return this._day;
    }

    set day(day) {

        if (day === undefined) return;

        if (!this.check_max_day(day)) return;

        this._day = day;

        if (this._day < 1) {
            this.subtract_month()
            this._day = this.num_days;
        } else if (this._day > this.num_days) {
            this.add_month();
            this._day = 1;
        }

    }

    add_year() {
        this.year++;
    }

    subtract_year() {
        this.year--;
    }


    add_month() {
        this.month++;
    }

    subtract_month() {
        this.month--;
    }


    add_day() {
        this.day++;
    }

    subtract_day() {
        this.day--;
    }
}
