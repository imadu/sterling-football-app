class Official {
    name: string;
    position: string;
}
export class RegisterDTO {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  username: string;
  role?: string;
}

export class FixtureDTO {
  fixtureDate: Date;
  homeTeam: string;
  awayTeam: string;
  stadium: string;
  capacity: number;
  kickOffTime: Date;
  officials: [Official]
}
