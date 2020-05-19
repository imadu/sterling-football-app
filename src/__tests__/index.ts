import mongoose from "mongoose";
import request from "supertest";
import dotenv from "dotenv";
import UserService from "../services/userService";
import TeamService from "../services/teamsService";
import FixturesService from "../services/fixturesService";
import AuthService from "../auth/auth";
import JWT from "../auth/jwt.strategy";
import Handler from "../utils/response.handlers";
import { FixtureDTO } from "../services/dtos/index.dto";

let fixturesService: FixturesService;
let userService: UserService;
let teamsService: TeamService;
let authService: AuthService;
let jwt: JWT;
let responseHandler: Handler;
let userID: any;
let fixtureID: any;
let teamID: any;
const userData1 = {
  firstName: "ikechukwu",
  lastName: "madu",
  username: "ikemadu",
  password: "default@123456",
  email: "ikechukwu@gmail.com",
  role: "admin",
};

const fixtureData: FixtureDTO = {
  homeTeam: "liverpool",
  awayTeam: "chelsea",
  stadium: "Anfield",
  capacity: 60000,
  kickOffTime: new Date("2020-05-23T16:00:00+01:00"),
  fixtureDate: new Date("2020-05-23"),
  matchOfficials: [{ name: "mark clattenburg", position: "head ref" }],
};

const teamData = {
  name: "Liverpool CF",
  stadium: "Anfield",
  players: [
    { name: "Sadio Mane", age: 26, position: "LWF" },
    { name: "Roberto Firmino", age: 26, position: "CF" },
    { name: "Mohammed Salah", age: 27, position: "RWF" },
    { name: "Divok Origi", age: 26, position: "CF" },
    { name: "Alisson Becker", age: 29, position: "GK" },
    { name: "Virgil Van Dijk", age: 29, position: "CB" },
  ],
};

beforeAll(async () => {
  dotenv.config();
  const globalAny: any = global;
  await mongoose.connect(
    globalAny.__MONGO_URI__,
    { useNewUrlParser: true, useCreateIndex: true },
    (err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    }
  );
  responseHandler = new Handler();
  userService = new UserService();
  teamsService = new TeamService();
  fixturesService = new FixturesService();
  jwt = new JWT(userService, responseHandler);
  authService = new AuthService(jwt, userService, responseHandler);
}, 12000);

afterAll(async () => {
  mongoose.connection.close();
});

it("create a user successfully", async () => {
  const newUserData = await userService.Create(userData1);
  userID = newUserData._id;
  expect(newUserData._id).toBeDefined();
  expect(newUserData.firstName).toBe(userData1.firstName);
  expect(newUserData.email).toBe(userData1.email);
  expect(newUserData.lastName).toBe(userData1.lastName);
  expect(newUserData.role).toBe(userData1.role);
  expect(newUserData.username).toBe(userData1.username);
});
it("create a user successfully", async () => {
  const userData2 = {
    firstName: "stan",
    lastName: "madueke",
    username: "elo80ka",
    password: "default@123456",
    email: "stanmadueke@gmail.com",
    role: "regular",
  };
  const newUserData = await userService.Create(userData2);
  expect(newUserData._id).toBeDefined();
  expect(newUserData.firstName).toBe(userData2.firstName);
  expect(newUserData.email).toBe(userData2.email);
  expect(newUserData.lastName).toBe(userData2.lastName);
  expect(newUserData.role).toBe(userData2.role);
  expect(newUserData.username).toBe(userData2.username);
});
it("create a user successfully", async () => {
  const userData3 = {
    firstName: "Kabiru",
    lastName: "Ipaye",
    username: "kaybythe",
    password: "default@123456",
    email: "kaybythe@gmail.com",
    role: "admin",
  };
  const newUserData = await userService.Create(userData3);
  expect(newUserData._id).toBeDefined();
  expect(newUserData.firstName).toBe(userData3.firstName);
  expect(newUserData.email).toBe(userData3.email);
  expect(newUserData.lastName).toBe(userData3.lastName);
  expect(newUserData.role).toBe(userData3.role);
  expect(newUserData.username).toBe(userData3.username);
});

it("should return one user", async () => {
  const user = await userService.FindByID(userID);
  expect(user._id).toEqual(userID);
  expect(user.password).toBeFalsy();
  expect(user.username).toBe(userData1.username);
});

it("should modifiy a user", async () => {
  const modifiedUser = {
    firstName: "ikechukwu",
    lastName: "madu",
    username: "ikemadu2",
    email: "ikechukwu.madu1@gmail.com",
    role: "admin",
  };
  const modified = await userService.Update(userID, modifiedUser);
  expect(modified.username).toBe(modifiedUser.username);
  expect(modified._id).toEqual(userID);
  expect(modified.email).toBe(modifiedUser.email);
});

it("should return an array of 3 users", async () => {
  const users = await userService.FindAll();
  expect(users.length).toBe(3);
});

it("create a fixture successfully", async () => {
  const newFixture = await fixturesService.Create(fixtureData);
  fixtureID = newFixture._id;
  expect(newFixture._id).toBeDefined();
  expect(newFixture.homeTeam).toBe(fixtureData.homeTeam);
  expect(newFixture.awayTeam).toBe(fixtureData.awayTeam);
  expect(newFixture.status).toBe("pending");
  expect(newFixture.matchOfficials.length).toBe(1);
});

it("create second fixture successfully", async () => {
  const fixtureData2: FixtureDTO = {
    homeTeam: "Arsenal",
    awayTeam: "Necastle",
    stadium: "Emirates",
    capacity: 75000,
    kickOffTime: new Date("2020-05-23T16:00:00+01:00"),
    fixtureDate: new Date("2020-05-23"),
    matchOfficials: [
      { name: "mark clattenburg", position: "head ref" },
      {
        name: "Stan",
        position: "Assistant ref",
      },
      {
        name: "John Doe",
        position: "linesman 1",
      },
      {
        name: "Charley",
        position: "linesman 2",
      },
    ],
  };
  const newFixture = await fixturesService.Create(fixtureData2);
  expect(newFixture._id).toBeDefined();
  expect(newFixture.homeTeam).toBe(fixtureData2.homeTeam);
  expect(newFixture.awayTeam).toBe(fixtureData2.awayTeam);
  expect(newFixture.status).toBe("pending");
  expect(newFixture.matchOfficials.length).toBe(4);
});

it("create third fixture successfully", async () => {
  const fixtureData3: FixtureDTO = {
    homeTeam: "Manchester United",
    awayTeam: "Manchester City",
    stadium: "Old Trafford",
    capacity: 80000,
    kickOffTime: new Date("2020-05-23T16:00:00+01:00"),
    fixtureDate: new Date("2020-05-23"),
    matchOfficials: [
      { name: "mark clattenburg", position: "head ref" },
      {
        name: "Stan",
        position: "Assistant ref",
      },
      {
        name: "John Doe",
        position: "linesman 1",
      },
      {
        name: "Charley",
        position: "linesman 2",
      },
    ],
  };
  const newFixture = await fixturesService.Create(fixtureData3);
  expect(newFixture._id).toBeDefined();
  expect(newFixture.homeTeam).toBe(fixtureData3.homeTeam);
  expect(newFixture.awayTeam).toBe(fixtureData3.awayTeam);
  expect(newFixture.status).toBe("pending");
  expect(newFixture.matchOfficials.length).toBe(4);
  expect(newFixture.score).toBe(0);
});

it("should create a link for the fixture", async () => {
  const link = await fixturesService.GenrateFixtureLink(fixtureID);
  expect(link.length).toBeGreaterThan(0);
  expect(link).toBe(`${process.env.HOST}/fixtures/${fixtureID}`);
});

it("should return a fixture", async () => {
  const fixture = await fixturesService.FindByID(fixtureID);
  expect(fixture._id).toEqual(fixtureID);
  expect(fixture.score).toBe(0);
  expect(fixture.status).toBe("pending");
  expect(fixture.homeTeam).toBe(fixtureData.homeTeam);
});

it("should return an array of fixtures", async () => {
  const query = { limit: 10, page: 1 };
  const fixtures = await fixturesService.FindAllTodayFixtures(query);
  expect(fixtures.length).toBe(3);
  fixtures.forEach((element) => {
    expect(element.status).toBe("pending");
    expect(element.score).toBe(0);
  });
});

it("should update a fixture", async () => {
  const modifiedFixture: FixtureDTO = {
    homeTeam: "liverpool",
    awayTeam: "chelsea",
    stadium: "Anfield",
    score: 10,
    status: "inprogress",
    capacity: 60000,
    kickOffTime: new Date("2020-05-23T16:00:00+01:00"),
    fixtureDate: new Date("2020-05-23"),
    matchOfficials: [{ name: "mark clattenburg", position: "head ref" }],
  };

  const modified = await fixturesService.Update(fixtureID, modifiedFixture);
  expect(modified.status).toBe(modifiedFixture.status);
  expect(modified.score).toBe(modifiedFixture.score);
});

it("should return a movie in progress", async () => {
  const date = "2020-05-23";
  const status = "inprogress";

  const inProgress = await fixturesService.FindFixturesOnStatus(date, status);
  inProgress.forEach((element) => {
    expect(element.status).toBe(status);
  });
});

it("should create a team", async () => {
  const newTeam = await teamsService.Create(teamData);
  expect(newTeam._id).toBeDefined();
  expect(newTeam.name).toBe(teamData.name);
  expect(newTeam.players[0].name).toBe(teamData.players[0].name);
  expect(newTeam.players[0].age).toBe(teamData.players[0].age);
  expect(newTeam.players[0].position).toBe(teamData.players[0].position);
});

it("should create another team", async () => {
  const teamData = {
    name: "Manchester United",
    stadium: "old trafford",
    players: [
      { name: "Marcus Rashford", age: 24, position: "LWF" },
      { name: "Lindelof", age: 26, position: "CB" },
      { name: "Daniel James", age: 21, position: "RWF" },
      { name: "Odion Ighalo", age: 28, position: "CF" },
      { name: "David De Gea", age: 29, position: "GK" },
    ],
  };
  const newTeam = await teamsService.Create(teamData);
  teamID = newTeam._id;
  expect(newTeam._id).toBeDefined();
  expect(newTeam.name).toBe(teamData.name);
  expect(newTeam.players[0].name).toBe(teamData.players[0].name);
  expect(newTeam.players[0].age).toBe(teamData.players[0].age);
  expect(newTeam.players[0].position).toBe(teamData.players[0].position);
});

it("should return an array of teams", async () => {
  const query = { limit: 10, page: 1 };
  const teams = await teamsService.FindAllTeams(query);
  teams.forEach((element) => {
    expect(element.name).toBeDefined();
    expect(element.players.length).toBeGreaterThan(2);
  });
  expect(teams.length).toBe(2);
});

it("should return a team", async () => {
  const team = await teamsService.FindTeam("Manchester United");
  expect(team._id).toBeDefined();
  expect(team.name).toMatch("Manchester United");
  expect(team.players.length).toBeGreaterThan(2);
});

it("should update a team", async () => {
  const updatedTeam = {
    name: "Manchester United",
    stadium: "old trafford",
    players: [
      { name: "Marcus Rashford", age: 24, position: "LWF" },
      { name: "Lindelof", age: 26, position: "CB" },
      { name: "Daniel James", age: 21, position: "RWF" },
      { name: "Odion Ighalo", age: 28, position: "CF" },
      { name: "David De Gea", age: 29, position: "GK" },
      { name: "Paul Pogba", age: 27, position: "CMF" }
    ],
  };
  const update = await teamsService.UpdateTeam(teamID, updatedTeam)
  expect(update.players.length).toBe(6)
});

