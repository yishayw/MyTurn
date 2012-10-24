// "room" class
function room(data) {
   
    this.id = String(data.id);
    this.name = String(data.name);
    this.discussionLength = Number(data.discussionLength) || 0;
    this.turnLength = Number(data.turnLength) || 0;
    this.userIds = [];
    this.users = [];
}

module.exports = room;