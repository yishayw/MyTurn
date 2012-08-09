// "room" class
function room(data) {
   
    this.name = String(data.name);
    this.discussionLength = Number(data.discussionLength) || 0;
    this.turnLength = Number(data.turnLength) || 0;
}

module.exports = room;