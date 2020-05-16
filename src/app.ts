import express, {Application, Request, Response, NextFunction} from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyparser from 'body-parser';


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
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.setHeader('Access-Control-Allow-Headers', '*');
            res.setHeader('Access-Control-Allow-Credentials', 'true');

            if (req.method === 'OPTIONS') {
                res.sendStatus(200);
            }

            next();
        });

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


