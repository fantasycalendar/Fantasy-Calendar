import * as utils from "../../../utils.js";

export default function CalculatesAndCachesProperties(obj){

    return new Proxy(obj, {
        get: function(target, prop){
            if(target[prop]) return Reflect.get(target, prop);
            const calculateProp = `calculate${utils.capitalizeFirstLetter(prop)}`;
            if(!(calculateProp in target)) throw new Error(`Can't find property for ${calculateProp}`);
            return target[calculateProp];
        },
        set: function(target, prop, value){
            if(prop in target){
                target[prop] = value;
            }else{
                target['stateCache'].put(prop, value);
            }
            return true;
        }
    })

}
