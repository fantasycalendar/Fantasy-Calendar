class Perms {
    constructor(userid, owner, level, playerLevel) {

        this.userid = userid;
        this.level = level;
        this.owner = owner;
        this.playerLevel = playerLevel;

        this.levels = {
            'free': 0,
            'timekeeper': 1,
            'worldbuilder': 2,
            'superadmin': 5000,
        };

        this.playerLevels = {
            'guest': 0,
            'observer': 1,
            'player': 2,
            'co-owner': 3
        }

    }

    user_at_least(level) {
        return this.levels[this.level] >= this.levels[level];
    }

    player_at_least(level) {
        return this.owner || this.playerLevels[this.playerLevel] >= this.playerLevels[level];
    }
}

module.exports = Perms;
