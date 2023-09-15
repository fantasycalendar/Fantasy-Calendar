import {getProperty} from "@/helpers";
import * as helpers from "@/helpers";

export default class CalendarEvent {

    static make(attributes, calendar){
        return attributes.type === "complex"
            ? new this(attributes, calendar)
            : new SimpleCalendarEvent(attributes, calendar)

    }

    constructor(attributes, calendar) {
        this.attributes = attributes;
        this.calendar = calendar;

        this.name = attributes?.name ?? "";
        this.description = attributes?.description ?? "";
        this.event_category_id = attributes?.event_category_id ?? "";
        this.conditions = new EventConditionGroup({
            type: "inclusive",
            conditions: this.attributes?.conditions ?? []
        }, this);
    }

    evaluate(dateData){
        return this.conditions.evaluate(dateData);
    }

}

class SimpleCalendarEvent extends CalendarEvent {

    evaluate(dateData) {
        return dateData.year === this.attributes.date.year
            && dateData.month === this.attributes.date.month
            && dateData.day === this.attributes.date.day;
    }

}

class Operator {

    static evaluators = {
        "single": this.evaluateSingle,
        "and": this.evaluateAnd,
        "or": this.evaluateOr,
        "xor": this.evaluateXor,
        "nand": this.evaluateNand,
        "count": this.evaluateCount
    }

    constructor(operator, evaluators) {
        this.operator = operator;
        this.evaluators = evaluators.sort((a, b) => b.depth - a.depth);
    }

    evaluate(dateData){
        return Operator.evaluators[this.operator ?? "single"](this.evaluators, dateData);
    }

    static evaluateSingle(evaluators, dateData){
        return evaluators[0].evaluate(dateData);
    }

    static evaluateAnd(evaluators, dateData){
        return evaluators[0].evaluate(dateData) && evaluators[1].evaluate(dateData);
    }

    static evaluateOr(evaluators, dateData){
        return evaluators[0].evaluate(dateData) || evaluators[1].evaluate(dateData);
    }

    static evaluateXor(evaluators, dateData){
        return evaluators[0].evaluate(dateData) ^ evaluators[1].evaluate(dateData);
    }

    static evaluateNand(evaluators, dateData){
        return !(evaluators[0].evaluate(dateData) && evaluators[1].evaluate(dateData));
    }

    static evaluateCount(evaluators, dateData){
        return evaluators.reduce((acc, condition) => acc + condition.evaluate(dateData), 0);
    }

}

class EventConditionGroup {

    static evaluators = {
        "inclusive": this.evaluateInclusive,
        "exclusive": this.evaluateExclusive,
        "count": this.evaluateCount,
    }

    static makeCondition(condition, event, parent) {
        return condition.type === "group"
            ? new EventConditionGroup(condition, event, parent)
            : new EventCondition(condition, event, parent);
    }

    constructor(attributes, event, parent) {
        this.attributes = attributes;
        this.event = event;
        this.parent = parent;

        this.groupType = this.attributes?.groupType ?? "inclusive";
        this.operator = this.constructOperator();
    }

    constructOperator() {

        let operator = null;
        const conditions = (this.attributes?.conditions ?? []);

        if (this.groupType === "count"){

            operator = new Operator("count", conditions.map(condition => EventConditionGroup.makeCondition(condition, this.event, this)));

        }else{

            if(conditions.length > 1){

                for (let i = 1; i < conditions.length; i += 2) {

                    const condition_a = operator || EventConditionGroup.makeCondition(conditions[i - 1], this.event, this);

                    const condition_b = EventConditionGroup.makeCondition(conditions[i + 1], this.event, this);

                    operator = new Operator(conditions[i].operator, [condition_a, condition_b]);

                }

            }else if(conditions.length === 1){

                const condition = EventConditionGroup.makeCondition(conditions[0], this.event, this);
                operator = new Operator("single", [condition])

            }
        }

        return operator;

    }

    evaluate(dateData) {
        return EventConditionGroup.evaluators[this.groupType](this, dateData);
    }

    static evaluateInclusive(group, dateData){
        return group.operator.evaluate(dateData) > 0;
    }

    static evaluateExclusive(group, dateData){
        return group.operator.evaluate(dateData) <= 0;
    }

    static evaluateCount(group, dateData){
        return group.operator.evaluate(dateData) >= group.attributes.targetCount;
    }

}


class EventCondition {

    static operands = {
        "==": (a, b) => a === b,
        ">": (a, b) => a > b,
        "<": (a, b) => a < b,
        ">=": (a, b) => a >= b,
        "<=": (a, b) => a <= b,
        "%": (a, b, c) => (a % b) === c,
    }

    constructor(attributes, event, depth) {
        this.attributes = attributes;
        this.event = event;
        this.depth = depth;
    }

    evaluate(dateData){
        const targetValue = helpers.getProperty(dateData, this.attributes.target)
        return EventCondition.operands[this.attributes.operand](targetValue, this.attributes.value);
    }

}
