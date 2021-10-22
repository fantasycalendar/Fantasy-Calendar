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

    skipWhile(callback) {
        let done = false;
        return this.filter(elem => {
            const result = callback(elem);
            if (!result) done = true;
            return done || !result;
        });
    }

    sum(callback) {
        return this.reduce((sum, elem) => sum + callback(elem), 0);
    }

    sortByDesc(key) {
        return this.sort((a, b) => b[key] - a[key])
    }

    sortByAsc(key) {
        return this.sort((a, b) => a[key] - b[key])
    }

    sortBy(key) {
        return this.sortByAsc(key);
    }

}
