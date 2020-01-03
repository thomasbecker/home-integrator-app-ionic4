export class Room {
    private name: String;
    private color: String;

    constructor(name: String, color: String) {
        this.name = name;
        this.color = color;
    }

    getColor() {
        return this.color;
    }

    getName() {
        return this.name;
    }
}

export class Rooms {
    static readonly living = new Room('living', '#0099ff');
    static readonly sleeping = new Room('sleeping', '#0099ff');
    static readonly office = new Room('office', '#02FE18');
    static readonly basement = new Room('basement', '#8B4513');
}
