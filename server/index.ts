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

    ResHandler.success(res, {message: "Successfully uploaded to the server"});

  } catch (error) {
    ResHandler.fail(res, {message: "There was an error uploading to the server"});
  }
});

// get mods
app.get("/api/getMods/:profileId", (req: Request, res: Response) => {
  try {
    let profile = profiles[req.params.profileId];

    fs.readdir(profile.path, {}, (err, files) => {
      if (err) {
        ResHandler.fail(res, {message: "There was an error reading mods"});
      } else {
        ResHandler.success(res, {files: files});
      }
    });
  } catch (error) {
    ResHandler.fail(res, {message: "No Profile Selected"});
  }
});

class ResHandler {
  static success<T>(res: Response, data: T) {
    res.send({success: true, data: data});
  }

  static fail<T>(res: Response, data: {data?: T, message?: string, code?: number}) {
    res.status(data.code ?? 500).send({success: false, ...data});
  }
}
