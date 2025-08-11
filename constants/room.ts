type RoomName = "Pokoj 1" | "Pokoj 2" | "Pokoj 3" | "Pokoj 4" | "Pokoj 5";

interface RoomConfig {
  name: RoomName;
  capacity: number;
}

export class Room {
  private static readonly rooms = new Map<RoomName, Room>();
  
  private static readonly roomConfigs: RoomConfig[] = [
    { name: "Pokoj 1", capacity: 4 },
    { name: "Pokoj 2", capacity: 4 },
    { name: "Pokoj 3", capacity: 4 },
    { name: "Pokoj 4", capacity: 4 },
    { name: "Pokoj 5", capacity: 6 },
  ];

  public readonly name: RoomName;
  public readonly capacity: number;

  private constructor(config: RoomConfig) {
    this.name = config.name;
    this.capacity = config.capacity;
  }

  static {
    this.roomConfigs.forEach(config => {
      this.rooms.set(config.name, new Room(config));
    });
  }

  static getRoom(name: RoomName): Room {
    return this.rooms.get(name)!;
  }

  static getAllRooms(): Room[] {
    return Array.from(this.rooms.values());
  }

  static getBedsCount(roomNames: RoomName[]): number {
    return roomNames.reduce((total, roomName) => {
      const room = this.getRoom(roomName);
      return total + room.capacity 
    }, 0);
  }
}