import { Router, Request, Response } from "express";
import { createValidator } from "express-joi-validation";
import AuthService from "../auth/auth";
import UserController from "../controllers/user.controller";
import FixtureController from "../controllers/fixture.controller";
import TeamController from "../controllers/teams.controller";
import {
  createUserSchema,
  createFixturesSchema,
  createTeamSchema,
} from "../validations/index";
import JWT from "../auth/jwt.strategy";
import UserService from "../services/userService";
import Handler from "../utils/response.handlers";
import FixturesService from "../services/fixturesService";
import TeamService from "../services/teamsService";

class IndexRoute {
  public router: Router;
  authService: AuthService;
  userController: UserController;
  fixtureController: FixtureController;
  teamController: TeamController;
  jwt: JWT;

  constructor(
    authService: AuthService,
    userController: UserController,
    fixtureController: FixtureController,
    teamController: TeamController,
    jwt: JWT
  ) {
    this.authService = authService;
    this.fixtureController = fixtureController;
    this.teamController = teamController;
    this.userController = userController;
    this.jwt = jwt;
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    const expressJoi = createValidator();
    this.router.get("/", (req, res) => {
      return res.status(200).send("Sterling Bank APP");
    });
    /*All auth routes*/
    this.router.post(
      "/auth/signup",
      expressJoi.body(createUserSchema),
      this.authService.signup
    );
    this.router.post("/auth/login", this.authService.login);

    /*All user routes*/
    this.router.get("/user/", this.jwt.isAdmin, this.userController.Get);
    this.router.get(
      "/user/:username",
      this.jwt.isAdmin,
      this.userController.FindOne
    );
    this.router.post(
      "/user/",
      expressJoi.body(createUserSchema),
      this.userController.Create
    );
    this.router.put(
      "/user/:id",
      this.jwt.isAdmin,
      this.userController.UpdateOne
    );
    this.router.delete(
      "/user/:id",
      this.jwt.isAdmin,
      this.userController.Delete
    );

    /*All fixture routes*/
    this.router.get(
      "/fixtures",
      this.jwt.checkToken,
      this.fixtureController.FindAll
    );
    this.router.get(
      "/fixtures/status/",
      this.jwt.checkToken,
      this.fixtureController.FindOnStatus
    );
    this.router.get(
      "/fixtures/:id",
      this.jwt.checkToken,
      this.fixtureController.FindOne
    );
    this.router.get(
      "/fixtures/query/",
      this.jwt.checkToken,
      this.fixtureController.FindOnQuery
    );
    this.router.get(
      "/fixtures/generate/:id",
      this.jwt.checkToken,
      this.fixtureController.GenerateLink
    );

    this.router.post(
      "/fixtures",
      expressJoi.body(createFixturesSchema),
      this.jwt.isAdmin,
      this.fixtureController.Create
    );
    this.router.put(
      "/fixtures/:id",
      expressJoi.body(createFixturesSchema),
      this.jwt.isAdmin,
      this.fixtureController.UpdateFixture
    );
    this.router.delete(
      "/fixtures/:id",
      this.jwt.isAdmin,
      this.fixtureController.DeleteFixture
    );

    /*All team routes*/
    this.router.get(
      "/teams/",
      this.jwt.checkToken,
      this.teamController.FindAll
    );
    this.router.get(
      "/teams/:name",
      this.jwt.checkToken,
      this.teamController.FindOne
    );
    this.router.post(
      "/teams/",
      expressJoi.body(createTeamSchema),
      this.jwt.isAdmin,
      this.teamController.Create
    );
    this.router.put(
      "/teams/:id",
      expressJoi.body(createTeamSchema),
      this.jwt.isAdmin,
      this.teamController.UpdateTeam
    );
    this.router.delete(
      "/teams/:id",
      this.jwt.isAdmin,
      this.teamController.DeleteTeam
    );
  }
}

let userService = new UserService();
let teamService = new TeamService();
let fixtureService = new FixturesService();
let responseHandler = new Handler();
let jwt = new JWT(userService, responseHandler);
let authService = new AuthService(jwt, userService, responseHandler);
let userController = new UserController(userService, responseHandler);
let fixtureController = new FixtureController(fixtureService, responseHandler);
let teamController = new TeamController(teamService, responseHandler);
export const appRoutes = new IndexRoute(
  authService,
  userController,
  fixtureController,
  teamController,
  jwt
).router;
