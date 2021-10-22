export default class Era {

    constructor(attributes) {
        this.name = attributes['name'];
        this.description = attributes['description'];
        this.formatting = attributes['formatting'];
        this.settings = attributes['settings'];
        this.date = attributes['date'];
        this.year = this.date.year;
        this.month = this.date.timespan;
        this.day = this.date.day;
    }

    get endsYear() {
        return this.getSetting("ends_year", false) !== false;
    }

    endsGivenYear(year) {
        return this.endsYear && year === this.year;
    }

    getSetting(name, fallback = false) {
        return this.settings[name] ?? fallback;
    }

}
