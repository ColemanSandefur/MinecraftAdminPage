import express from 'express';
import {modApp} from './mod/modRoutes';
import {profileApp} from './profile/profileRoutes';

const api = express();

api.use('/mod', modApp);
api.use('/profile', profileApp);

export {api as apiApp};
