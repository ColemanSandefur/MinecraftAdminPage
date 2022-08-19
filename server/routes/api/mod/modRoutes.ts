import express, { Request, Response } from 'express';
import multer from 'multer';
import {Mod} from './modManager';
import {ResHandler} from '../../../util/util';
import {profileManager} from '../../..';

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

    let profile = profileManager.getProfile(body.profileId);
    body.fileData = (typeof body.fileData === 'string') ? JSON.parse(body.fileData as unknown as string) : body.fileData;

    if (profile == null) {
      ResHandler.fail(res, {message: "Profile not available"});
      return;
    }

    if (Array.isArray(req.files)) {
      await Promise.all(req.files.map((file, idx) => {
        let fileData = body.fileData?.[idx];
        const mod: Mod = {
          fileName: file.originalname,
          name: fileData?.name,
          description: fileData?.description,
        };
        profile?.manager.addMod(mod, {oldPath: file.path, autoSave: false});
      }));

      profile?.manager.saveMetadata();
    }

    ResHandler.success(res, {message: "Successfully uploaded to the server"});

  } catch (error) {
    ResHandler.fail(res, {message: "There was an error uploading to the server"});
  }
});

// get mods
mod.get("/getMods/:profileId", async (req: Request, res: Response) => {
  try {
    let profile = profileManager.getProfile(req.params.profileId);

    if (profile == null) {
      ResHandler.fail(res, {message: "Profile not available"});
      return;
    }

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

    let profile = profileManager.getProfile(body.profileId);
    let fileName = body.fileName;

    if (profile == null) {
      ResHandler.fail(res, {message: "Profile not available"})
      return;
    }

    await profile.manager.removeMod(fileName);
    ResHandler.success(res, {message: "Successfully removed file from server"});

  } catch (error) {
    ResHandler.fail(res, {message: "There was an error uploading to the server"});
  }
});

export {mod as modApp};
