import * as utils from "../../../utils.js";

export default function CalculatesAndCachesProperties(obj){

    return new Proxy(obj, {
        get: function(target, prop){
            if(prop in target) Reflect.get(target, prop);
            const calculateProp = `calculate${utils.capitalizeFirstLetter(prop)}`
            return Reflect.get(target, calculateProp)();
        },
        set: function(target, prop){
            this.stateCache[prop] = target;
        }
    })

}
