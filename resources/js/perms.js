class Perms {
    constructor(level) {
        this.level = level;

        this.levels = {
            'creator': 0,
            'timekeeper': 1,
            'worldbuilder': 2,
            'superadmin': 5000,
        };
    }

    at_least(level) {
        return this.levels[this.level] >= this.levels[level];
    }
}

module.exports = Perms;
