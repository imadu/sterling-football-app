import express, { Request, Response, NextFunction} from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyparser from 'body-parser';
import {appRoutes} from './routes/Index'
import rateLimit from 'express-rate-limit';


class App {
    public app: express.Application
    private port: number
    private db: string

    constructor(){
        this.app = express()
        this.configure()
    }

    public configure = () => {
        dotenv.config();
        this.port = Number(process.env.PORT);
        this.db = process.env.DB;
        const limiter = rateLimit({
            windowMs: 60 * 60 * 1000,
            max: 100
        })
        this.app.use(bodyparser.urlencoded({ extended: true }));
        this.app.use(bodyparser.json());
        this.app.use('/v1/',limiter, appRoutes);

    }

    public start = () => {
        mongoose.connect(this.db).then(() => {
            console.log('connected to the database')
        }).catch((error: any) => {
            console.log('something went wrong', error)
        })

        this.app.listen(this.port || process.env.PORT)
        console.log(`app running at ${this.port}`)

    }
}

export default App;


