import express from 'express';
import dotenv from 'dotenv';
import {Profile} from './profile.model';
import {ModManager} from './routes/api/mod/modManager';
import {apiApp} from './routes/api/apiRoutes';
import path from 'path';
import {ProfileManager} from './routes/api/profile/profileManager';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

export const profileManager = new ProfileManager();

async function init() {
  await profileManager.init().then(() => {
      console.log('loaded profiles');
  });

  console.log('mounting api');
  app.use('/api', apiApp);

  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
  });
}

init()
