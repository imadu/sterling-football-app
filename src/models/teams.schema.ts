import * as mongoose from 'mongoose'

export const TeamsSchema = new mongoose.Schema({
    name: String,
    stadium: String,
    players: []
})