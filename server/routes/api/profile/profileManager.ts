import {Profile} from "../../../profile.model";
import path from 'path';
import {readFile, writeFile} from "fs/promises";
import {ModManager} from "../mod/modManager";

export type RawProfile = Omit<Profile, 'manager'>;

export interface RawProfileHolder {
    [id: string]: RawProfile;
}

export interface ProfileHolder {
    [id: string]: Profile
}

interface ProfileFile {
    profiles: RawProfileHolder 
}

export class ProfileManager {
    private profiles: ProfileHolder

    constructor() {
        this.profiles = {};
    }

    getProfilePath() {
        return path.resolve('.profiles');
    }

    async init() {
        await this.loadProfiles();
    }

    async loadProfiles() {
        try {
            let fileData: ProfileFile = JSON.parse(await readFile(this.getProfilePath(), {encoding: "utf8"}));

            if (fileData.profiles == null) {
                fileData.profiles = {};
            }

            await Promise.all(Object.values(fileData.profiles).map((rawProfile) => {
                this.addProfile(rawProfile, {autoSave: false});
            }));
        } catch (err) { console.log(err) }
    }

    async saveProfiles() {
        try {
            const newProfiles: RawProfileHolder = {};
            Object.values(this.profiles).forEach((profile) => {
                const newProfile = {...profile};
                delete (newProfile as any).manager


                newProfiles[newProfile.id] = newProfile;
            });
            const profileFile: ProfileFile = {
                profiles: newProfiles 
            };

            const stringify = JSON.stringify(profileFile, null, '\t');

            if (stringify) {
                await writeFile(this.getProfilePath(), stringify);
            }
        } catch {}
    }

    async addProfile(rawProfile: RawProfile, options?: {autoSave?: boolean}) {
        for (const value of Object.values(this.profiles)) {
            if (value.path === rawProfile.path) {
                throw new Error("Cannot have two profiles in the same location");
            }
        }
        if (rawProfile.path)
        this.profiles[rawProfile.id] = {...rawProfile, manager: new ModManager(rawProfile.path)};

        await this.profiles[rawProfile.id].manager.loadModsDir();

        if ((options?.autoSave ?? true) === true) {
            await this.saveProfiles();
        }
    }

    async removeProfile(profileId: string, options?: {autoSave?: boolean}) {
        delete this.profiles[profileId];

        if ((options?.autoSave ?? true) === true) {
            await this.saveProfiles();
        }
    }

    getProfiles() {
        return this.profiles;
    }

    getProfile(id: string) {
        return (this.profiles[id]) ? this.profiles[id] : undefined;
    }
}
