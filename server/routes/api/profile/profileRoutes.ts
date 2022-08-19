import express, { Request, Response } from 'express';
import {profileManager} from '../../..';
import {ResHandler} from '../../../util/util';
import {RawProfile} from './profileManager';

const profile = express();

profile.get('/getProfiles', (_req: Request, res: Response) => {
    ResHandler.success(res, {profiles: profileManager.getProfiles()});
});

profile.post("/createProfile", async (req: Request, res: Response) => {
    try {
        const rawProfile: RawProfile = req.body.profile;

        await profileManager.addProfile(rawProfile);

        ResHandler.success(res, {message: "Successfully created profile"});
    } catch (err: any) {
        console.error(`Failed to finish '/createProfile': `, (err as Error).message);
        ResHandler.fail(res, {message: "Failed creating profile"})
    }
});

export {profile as profileApp};
