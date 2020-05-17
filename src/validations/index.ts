import * as Joi from "@hapi/joi";

const playerSchema = Joi.object().keys({
  name: Joi.string().lowercase().max(50).required(),
  age: Joi.number().required(),
  position: Joi.string().max(3).required(),
})

export const createUserSchema = Joi.object().keys({
  email: Joi.string().lowercase().email().required(),
  firstName: Joi.string().lowercase().max(50).required(),
  lastName: Joi.string().lowercase().optional(),
  username: Joi.string().lowercase().max(50).required(),
  password: Joi.string().min(10).required(),
  role: Joi.string().optional(),
});

export const createFixturesSchema = Joi.object().keys({
  homeTeam: Joi.string().lowercase().required(),
  awayTeam: Joi.string().lowercase().required(),
  stadium: Joi.string().lowercase().required(),
  capacity: Joi.number().optional(),
  kickOffTime: Joi.date().required(),
  fixtureDate: Joi.date().required(),
});


export const createTeamSchema = Joi.object().keys({
  name: Joi.string().lowercase().required(),
  stadium: Joi.string().lowercase().required(),
  players: Joi.array().items(playerSchema)

})