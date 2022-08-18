import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import {Profile} from './profile.model';
import {ModManager} from './routes/api/mod/modManager';
import {apiApp} from './routes/api/apiRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT;

export const profiles: {[id: string]: Profile} = {
  someRandomID: {
    name: "My First Id",
    id: "someRandomID",
    path: process.env.MINECRAFT_PATH!,
    manager: new ModManager(process.env.MINECRAFT_PATH!),
  }
};

for (const profile of Object.values(profiles)) {
  profile.manager.loadModsDir();
}

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
  
app.use('/api', apiApp);
