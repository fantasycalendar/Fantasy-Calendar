import { Collection } from 'collect.js'
import * as utils from "../../utils.js";
import Epoch from "../EpochService/Epoch.js";

export default class EpochsCollection extends Collection{

    insert(epoch) {
        return this.put(epoch.slug, epoch);
    }

    insertFromArray(epochAttributes) {
        return this.insert(new Epoch(epochAttributes));
    }

    hasDate(year, month = 0, day = 1) {
        return this.has(utils.date_slug(year, month, day));
    }

    getByDate(year, month = 0, day = 1) {
        const date = utils.date_slug(year, month, day);

        if(!this.hasDate(year, month, day)){
            throw new Error(`Error trying to retrieve nonexistent date '${date}'. Date is either invalid or not generated when we got to this point.`)
        }

        return this.get(date);
    }

    whereYear(year) {
        return this.where('year', "=", year);
    }

    whereMonthIndexOfYear(monthIndexOfYear) {
        return this.where('monthIndexOfYear', monthIndexOfYear);
    }

}
