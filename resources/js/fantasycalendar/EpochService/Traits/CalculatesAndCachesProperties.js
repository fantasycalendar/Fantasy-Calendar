import * as utils from "../../../utils.js";

export default function CalculatesAndCachesProperties(obj){

    return new Proxy(obj, {

        set: function(target, propName, value){

            if(propName in target){
                target[propName] = value;
            }else{
                const statecache = Reflect.get(target, "statecache");
                statecache.put(propName, value);
            }

            return true;
        },

        get: function(target, propName, receiver){

            const originalProp = Reflect.get(target, propName);
            if(originalProp) return originalProp;

            const calculatePropName = `calculate${utils.capitalizeFirstLetter(propName)}`;
            const calculateProp = Reflect.get(target, calculatePropName);

            if(!calculateProp) throw new Error(`Can't find property for ${calculatePropName}`);

            const statecache = Reflect.get(target, "statecache");

            if(!statecache.has(propName) || statecache.get(propName) == null){
                const value = calculateProp.bind(receiver)();
                statecache.put(propName, value);
            }

            return statecache.get(propName);

        }

    })

}
