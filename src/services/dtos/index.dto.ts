export class Official {
  name: string;
  position: string;
}

class Player {
  name: string;
  age: number;
  position: string;
}
export class RegisterDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  username: string;
  role?: string;
}

export interface FixtureDTO {
  fixtureDate: Date;
  homeTeam: string;
  status?: string;
  score?: number;
  awayTeam: string;
  stadium: string;
  capacity: number;
  kickOffTime: Date;
  matchOfficials: {name: string, position: string}[];
}

export class UserDTO {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role?: string;
}

export class TeamDTO {
  name: string;
  stadium: string;
  Players?: Player[];
}
