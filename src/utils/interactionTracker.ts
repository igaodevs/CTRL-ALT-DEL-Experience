// Interaction tracker for managing user interactions and easter eggs

export interface EasterEgg {
  id: string;
  name: string;
  description: string;
  found: boolean;
}

export interface RoomState {
  id: string;
  visited: boolean;
  destroyed: boolean;
  interactions: string[];
}

class InteractionTracker {
  private readonly STORAGE_KEY = "ctrl_alt_del_state";
  private easterEggs: EasterEgg[] = [
    {
      id: "egg1",
      name: "Terminal Access",
      description: "Found the hidden terminal",
      found: false,
    },
    {
      id: "egg2",
      name: "Glitch in the Matrix",
      description: "Discovered the pattern",
      found: false,
    },
    {
      id: "egg3",
      name: "Digital Ghost",
      description: "Saw what wasn't there",
      found: false,
    },
    {
      id: "egg4",
      name: "Memory Leak",
      description: "Accessed restricted data",
      found: false,
    },
    {
      id: "egg5",
      name: "Void Caller",
      description: "Spoke to the void",
      found: false,
    },
    {
      id: "egg6",
      name: "Time Paradox",
      description: "Broke the timeline",
      found: false,
    },
    {
      id: "egg7",
      name: "Root Access",
      description: "Gained administrator privileges",
      found: false,
    },
  ];

  private rooms: RoomState[] = [
    { id: "boot", visited: false, destroyed: false, interactions: [] },
    { id: "audio", visited: false, destroyed: false, interactions: [] },
    { id: "surveillance", visited: false, destroyed: false, interactions: [] },
    { id: "button", visited: false, destroyed: false, interactions: [] },
    { id: "game", visited: false, destroyed: false, interactions: [] },
    { id: "counter", visited: false, destroyed: false, interactions: [] },
    { id: "stream", visited: false, destroyed: false, interactions: [] },
    { id: "matrix", visited: false, destroyed: false, interactions: [] },
  ];

  private hasInitialized = false;

  constructor() {
    this.loadState();
  }

  public init() {
    if (this.hasInitialized) return;
    this.loadState();
    this.hasInitialized = true;
  }

  private loadState() {
    try {
      const savedState = localStorage.getItem(this.STORAGE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        if (parsedState.easterEggs) this.easterEggs = parsedState.easterEggs;
        if (parsedState.rooms) this.rooms = parsedState.rooms;
      }
    } catch (error) {
      console.error("Failed to load state:", error);
    }
  }

  private saveState() {
    try {
      localStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify({
          easterEggs: this.easterEggs,
          rooms: this.rooms,
          lastUpdated: new Date().toISOString(),
        }),
      );
    } catch (error) {
      console.error("Failed to save state:", error);
    }
  }

  public findEasterEgg(id: string) {
    const egg = this.easterEggs.find((egg) => egg.id === id);
    if (egg && !egg.found) {
      egg.found = true;
      this.saveState();
      return true;
    }
    return false;
  }

  public getFoundEasterEggs() {
    return this.easterEggs.filter((egg) => egg.found);
  }

  public getTotalEasterEggs() {
    return this.easterEggs.length;
  }

  public visitRoom(id: string) {
    const room = this.rooms.find((room) => room.id === id);
    if (room) {
      room.visited = true;
      this.saveState();
    }
  }

  public destroyRoom(id: string) {
    const room = this.rooms.find((room) => room.id === id);
    if (room) {
      room.destroyed = true;
      this.saveState();
    }
  }

  public isRoomDestroyed(id: string) {
    const room = this.rooms.find((room) => room.id === id);
    return room ? room.destroyed : false;
  }

  public trackInteraction(roomId: string, interactionId: string) {
    const room = this.rooms.find((room) => room.id === roomId);
    if (room && !room.interactions.includes(interactionId)) {
      room.interactions.push(interactionId);
      this.saveState();
    }
  }

  public hasInteracted(roomId: string, interactionId: string) {
    const room = this.rooms.find((room) => room.id === roomId);
    return room ? room.interactions.includes(interactionId) : false;
  }

  public resetAllProgress() {
    this.easterEggs.forEach((egg) => (egg.found = false));
    this.rooms.forEach((room) => {
      room.visited = false;
      room.destroyed = false;
      room.interactions = [];
    });
    this.saveState();
  }
}

// Create a singleton instance
export const interactionTracker = new InteractionTracker();
