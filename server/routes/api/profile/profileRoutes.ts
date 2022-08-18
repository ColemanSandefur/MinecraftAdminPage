import express, { Request, Response } from 'express';
import {profiles} from '../../..';
import {ResHandler} from '../../../util/util';

const profile = express();

profile.get('/getProfiles', (req: Request, res: Response) => {
    ResHandler.success(res, {data: profiles});
});

export {profile as profileApp};
