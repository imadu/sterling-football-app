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

  constructor(
    authService: AuthService,
    userController: UserController,
    fixtureController: FixtureController,
    teamController: TeamController
  ) {
    this.authService = authService;
    this.fixtureController = fixtureController;
    this.teamController = teamController;
    this.userController = userController;
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    console.log("this is defined in the router as", this);
    const expressJoi = createValidator();

    this.router.get("/", (req: Request, res: Response) => {
      console.log("you got here");
      res.status(200).json("hello world");
    });
    /*All auth routes*/
    this.router.post("/auth/signup", this.authService.signup);
    this.router.post("/auth/login", this.authService.login);

    /*All user routes*/
    this.router.get("/user/", this.userController.Get);
    this.router.get("/user/:username", this.userController.FindOne);
    this.router.post(
      "/user/",
      expressJoi.query(createUserSchema),
      this.userController.Create
    );
    this.router.put("/user/:id", this.userController.UpdateOne);
    this.router.delete("/user/:id", this.userController.Delete);

    /*All fixture routes*/
    this.router.get("/fixtures", this.fixtureController.FindAll);
    this.router.get("/fixtures/status/", this.fixtureController.FindOnStatus);
    this.router.get("/fixtures/:id", this.fixtureController.FindOne);
    this.router.get("/fixtures/query/", this.fixtureController.FindOnQuery);
    this.router.post(
      "/fixtures",
      expressJoi.query(createFixturesSchema),
      this.fixtureController.Create
    );
    this.router.put(
      "/fixtures/:id",
      expressJoi.query(createFixturesSchema),
      this.fixtureController.UpdateFixture
    );
    this.router.delete("/fixtures/:id", this.fixtureController.DeleteFixture);

    /*All team routes*/
    this.router.get("/teams/", this.teamController.FindAll);
    this.router.get("/teams/:name", this.teamController.FindOne);
    this.router.post(
      "/teams/",
      expressJoi.query(createTeamSchema),
      this.teamController.Create
    );
    this.router.put(
      "/teams/",
      expressJoi.query(createTeamSchema),
      this.teamController.UpdateTeam
    );
    this.router.delete("/teams/:id", this.teamController.DeleteTeam);
  }
}
let jwt = new JWT();
let userService = new UserService();
let teamService  = new TeamService();
let fixtureService = new FixturesService();
let responseHandler = new Handler();
let authService = new AuthService(jwt, userService, responseHandler);
let userController = new UserController(userService, responseHandler);
let fixtureController = new FixtureController(fixtureService, responseHandler);
let teamController = new TeamController(teamService, responseHandler);
export const appRoutes = new IndexRoute(
  authService,
  userController,
  fixtureController,
  teamController
).router;
