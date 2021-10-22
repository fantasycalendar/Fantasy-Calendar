import Month from "../Month.js";
import Collection from "./Collection.js";

export default class MonthsCollection extends Collection {

    static fromArray(array, calendar) {
        return MonthsCollection.from(array.map((month, index) => {
            return new Month(month, index).setCalendar(calendar);
        }));
    }

    endsOn(era) {
        return (!era)
            ? this
            : MonthsCollection.from(this.slice(0, era.month + 1)).trimLastMonth(era);
    }

    trimLastMonth(era) {
        this.last().daysInYear = this.last().daysInYear.slice(0, era.day);
        return this;
    }

    last() {
        return this[this.length - 1];
    }

    hasId(id) {
        return this.filter((month) => {
            return month.id === id;
        }).length === 1;
    }

}
