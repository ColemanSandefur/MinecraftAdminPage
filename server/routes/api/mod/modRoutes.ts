import express, { Request, Response } from 'express';
import multer from 'multer';
import {profiles} from '../../..';
import {Mod} from './modManager';
import {ResHandler} from '../../../util/util';

const mod = express();
const upload = multer({
  dest: 'uploads',
});

interface AddModData {
  fileData: {
    fileName: string,
    name: string,
    description: string,
  }[],
  profileId: string,
}

mod.post("/addMod", upload.array('files', 20), async (req: Request, res: Response) => {
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
mod.get("/getMods/:profileId", async (req: Request, res: Response) => {
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

mod.post('/removeMod', async (req: Request, res: Response) => {
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

export {mod as modApp};
