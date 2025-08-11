export type RoomName = "Pokoj 1" | "Pokoj 2" | "Pokoj 3" | "Pokoj 4" | "Pokoj 5";
export type RoomId = "firstRoom" | "secondRoom" | "thirdRoom" | "fourthRoom" | "fifthRoom"

interface RoomConfig {
  name: RoomName;
  capacity: number;
  id: RoomId
}

export class Room {
  private static readonly rooms = new Map<RoomName, Room>();
  
  private static readonly roomConfigs: RoomConfig[] = [
    { id: "firstRoom", name: "Pokoj 1", capacity: 4 },
    { id: "secondRoom", name: "Pokoj 2", capacity: 4 },
    { id: "thirdRoom", name: "Pokoj 3", capacity: 4 },
    { id: "fourthRoom", name: "Pokoj 4", capacity: 4 },
    { id: "fifthRoom", name: "Pokoj 5", capacity: 6 },
  ];

  public readonly name: RoomName;
  public readonly id: RoomId;
  public readonly capacity: number;

  private constructor(config: RoomConfig) {
    this.name = config.name;
    this.capacity = config.capacity;
    this.id = config.id;
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