import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import {Profile} from './profile.model';
import multer from 'multer';
import {Mod, ModManager} from './modManager';
import {ResHandler} from './util/util';

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
    manager: new ModManager(process.env.MINECRAFT_PATH!),
  }
};

for (const profile of Object.values(profiles)) {
  profile.manager.loadModsDir();
}

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (_req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
  
interface AddModData {
  fileData: {
    fileName: string,
    name: string,
    description: string,
  }[],
  profileId: string,
}

app.post("/api/addMod", upload.array('files', 20), async (req: Request, res: Response) => {
  try {
    const body: AddModData = req.body;

    let profile = profiles[body.profileId];
    body.fileData = (typeof body.fileData === 'string') ? JSON.parse(body.fileData as unknown as string) : body.fileData;

    if (Array.isArray(req.files)) {
      await Promise.all(req.files.map((file, idx) => {
        let fileData = body.fileData?.[idx];
        const mod: Mod = {
          fileName: file.originalname,
          name: fileData?.name,
          description: fileData?.description,
        };
        profile.manager.addMod(mod, {oldPath: file.path, autoSave: false});
      }));

      profile.manager.saveMetadata();
    }

    ResHandler.success(res, {message: "Successfully uploaded to the server"});

  } catch (error) {
    ResHandler.fail(res, {message: "There was an error uploading to the server"});
  }
});

// get mods
app.get("/api/getMods/:profileId", async (req: Request, res: Response) => {
  try {
    let profile = profiles[req.params.profileId];

    try {
      await profile.manager.loadModsDir();
      const files = Object.values(profile.manager.managerData?.mods ?? []);

      ResHandler.success(res, {files: files});
    } catch {
      ResHandler.fail(res, {message: "There was an error reading mods"});
    }
  } catch (error) {
    ResHandler.fail(res, {message: "Unable to remove mod from server"});
  }
});

app.post('/api/removeMod', async (req: Request, res: Response) => {
  try {
    const body: {profileId: string, fileName: string} = req.body;

    let profile = profiles[body.profileId];
    let fileName = body.fileName;

    await profile.manager.removeMod(fileName);
    ResHandler.success(res, {message: "Successfully removed file from server"});

  } catch (error) {
    ResHandler.fail(res, {message: "There was an error uploading to the server"});
  }
});

