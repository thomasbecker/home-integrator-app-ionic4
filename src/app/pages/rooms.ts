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
    static readonly living = new Room('Living Room', '#0099ff');
    static readonly sleeping = new Room('Sleeping Room', '#FFE4C4');
    static readonly mobile = new Room('Mobile', '#c49200');
    static readonly office = new Room('Office', '#02FE18');
    static readonly basement = new Room('Basement', '#8B4513');
    static readonly utilityRoom = new Room('Utility Room', '#002fa2');

    // physically the following ones are not rooms, but from a data structure perspective they fit here. Maybe a new classname would be
    // nice...but not now
    static readonly leading = new Room('leading', '#FE9200');
    static readonly inlet = new Room('leading', '#0099ff');
    static readonly watertankMiddle = new Room('watertankMiddle', '#FF0900');
    static readonly watertankBottom = new Room('watertankBottom', '#FE9200');


}
