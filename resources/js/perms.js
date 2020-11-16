class Perms {
    constructor(userid, owner, level, playerLevel) {

        this.userid = userid;
        this.level = level;
        this.owner = owner;
        this.playerLevel = playerLevel;

        this.levels = {
            'free': 0,
            'timekeeper': 1,
            'superadmin': 5000,
        };

        this.playerLevels = {
            'guest': 0,
            'observer': 1,
            'player': 2,
            'co-owner': 3
        }

    }

    Timekeeper(level) {
        return this.levels[this.level] >= this.levels[level];
    }

    player_at_least(level) {
        return this.owner || this.playerLevels[this.playerLevel] >= this.playerLevels[level];
    }

    can_modify_event(event_id){
        return this.player_at_least('co-owner') || (this.player_at_least('player') && this.userid == events[event_id].creator_id);
    }

    user_is_owner(){
        return this.owner;
    }

    user_can_comment(){
        if(!static_data.settings.comments){
            return this.owner;
        }
        return this.player_at_least('player');
    }

    user_can_delete_comment(comment){
        return this.player_at_least('co-owner') || this.owner || comment.comment_owner;
    }
}

module.exports = Perms;
