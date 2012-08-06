// "user" class
function user(data, id, room) {
   
    this.id = String(id) || String(data.id);
    this.room = String(room);
    this.name = String(data.name) || "Anonymous";
    this.elapsedTime = Number(data.elapsedTime) || 0;
    this.lastTurnBeginning = Number(data.lastTurnBeginning) || 0;
}

module.exports = user;