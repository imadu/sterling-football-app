interface Player {
  name: string;
  age: number;
  position: string;
}

export interface ITeam {
  name: string;
  stadium: string;
  players: [Player];
}
