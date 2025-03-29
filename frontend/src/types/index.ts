export interface Location {
  id: number;
  name: string;
  lat: number;
  lon: number;
  address: string;
}

export interface Route {
  summary: {
    totalTime: number;
    totalDistance: number;
  };
  instructions: Instruction[];
  coordinates: Coordinate[];
}

export interface Instruction {
  text: string;
  distance: number;
  index: number;
}

export interface Coordinate {
  lat: number;
  lng: number;
}