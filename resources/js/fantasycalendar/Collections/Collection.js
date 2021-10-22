export default class Collection extends Array {

    static from(elements) {
        if (Array.isArray(elements)) {
            return new this(...elements);
        }
        return new this(elements);
    }

    times(num, callback) {
        for (let index = 0; index < num; index++) {
            this.push(callback(index));
        }
        return this;
    }

    reverse() {
        super.reverse();
        return this;
    }

    unshift(elem) {
        super.unshift(elem);
        return this;
    }

    push(elem) {
        super.push(elem);
        return this;
    }

    sort(callback) {
        super.sort(callback);
        return this;
    }

    reject(callback) {
        return this.filter(elem => !callback(elem));
    }

    unique() {
        const serialized = this.map(elem => JSON.stringify(elem));
        const deserialized = Array.from(new Set(serialized)).map(elem => JSON.parse(elem))
        return new this.constructor(...deserialized);
    }

    skipWhile(callback) {
        let done = false;
        return this.filter(elem => {
            const result = callback(elem);
            if (!result) done = true;
            return done || !result;
        });
    }

    hasId(id){
        return this.find(elem => elem?.id === id);
    }

    sum(callback) {
        return this.reduce((sum, elem) => sum + callback(elem), 0);
    }

    sortByDesc(key) {
        return this.sort((a, b) => b[key] - a[key])
    }

    sortBy(key) {
        return this.sort((a, b) => a[key] - b[key])
    }

    keyBy(key) {
        return this.map(elem => {
            const keyed = { [elem[key]]: elem };
            delete elem[key];
            return keyed;
        });
    }

}
