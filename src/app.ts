import express, { Request, Response, NextFunction} from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyparser from 'body-parser';
import {appRoutes} from './routes/Index'


class App {
    private app: express.Application
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
        this.app.use(bodyparser.urlencoded({ extended: true }));
        this.app.use(bodyparser.json());
        this.app.use('/v1/',appRoutes);
        this.app.use('/', (req: Request, res: Response) => {
            console.log('you got here');
            res.status(200).json('hello world')
        })

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

export default new App()


