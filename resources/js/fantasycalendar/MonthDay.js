export default class MonthDay {

    constructor(order, intercalary, isNumbered = true, name = false) {
        this.order = order;
        this.intercalary = intercalary;
        this.isNumbered = isNumbered;
        this.name = name;
    }

}
