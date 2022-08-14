import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import {Profile} from './profile.model';
import fs from 'fs';
import multer from 'multer';

dotenv.config();

const upload = multer({
  dest: 'uploads',
});

const app: Express = express();
const port = process.env.PORT;

const profiles: {[id: string]: Profile} = {
  someRandomID: {
    name: "My First Id",
    id: "someRandomID",
    path: process.env.MINECRAFT_PATH!,
  }
};

app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
  
interface AddModData {
  files: {
    name: string,
    data: string,
    description: string,
  }[],
  profileId: string,
}

app.post("/api/addMod", upload.array('files', 20), (req: Request, res: Response) => {
  try {
    const body: AddModData = req.body;

    let profile = profiles[body.profileId];

    if (Array.isArray(req.files)) {
      for (const file of req.files!) {
        fs.rename(file.path, profile.path + file.originalname, (err) => {if (err) {console.error(err)}});
      }
    }

    res.send({success: true, message: "Successfully uploaded to the server"});

  } catch (error) {
    res.send({success: false, message: "There was an error uploading to the server"});
  }
});

// get mods
app.get("/api/getMods/:profileId", (req: Request, res: Response) => {
  try {
    let profile = profiles[req.params.profileId];

    fs.readdir(profile.path, {}, (err, files) => {
      if (err) {
        console.error(err);
        res.send({success: false, message: "There was an error reading mods"});
      }

      res.send({success: true, files: files});
    })
  } catch (error) {
    res.send({success: false, message: "No profile selected"});
  }
});
