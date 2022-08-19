import React, {createContext, useState} from "react";
import axios from "axios";
import {ProfileAPI} from "./profile.model";

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export interface ModContextType {
  profiles: ProfileHolder;
  selectedProfile: string;
}

export interface ProfileHolder {
  [id: string]: ProfileType;
}
export interface ProfileType extends ProfileAPI {
  mods: ModData[];
}

export interface ModData {
  fileName: string;
  name?: string;
  description?: string;
}

export interface AddModData {
  file: File;
  name?: string;
  description?: string;
}

const initialModContext: ModContextType = {
  profiles: {},
  selectedProfile: '',
}

class ModContextState {
  mods: ModContextType;
  setMods: SetState<ModContextType>;

  constructor(mods: ModContextType, setMods: SetState<ModContextType>) {
    this.mods = mods;
    this.setMods = setMods;
  }

  getSelectedProfile() {
    let profile = this.mods.profiles[this.mods.selectedProfile];

    if (profile != null) {
      return profile;
    }

    return null;
  }

  setProfile(id: string) {
    this.setMods({...this.mods, selectedProfile: id});
  }

  // reload all the profiles
  async reloadProfiles(options?: {
    reloadMods?: boolean, // Reload all of the fetched profiles' mods (true)
    autoSelectProfile?: boolean, // If the selected profile doesn't exist, choose the first profile (true)
  }) {
    const response = await handleAxios(() => axios.get('/server/api/profile/getProfiles'));

    if (response && response.data) {
      let profileResponse: {[id: string]: ProfileAPI} = {...response.data.data.profiles};

      let profiles: ProfileHolder = {};

      Object.values(profileResponse).forEach((profile) => {
        profiles[profile.id]=({mods: [], ...profile})
      });

      let newProfiles = {...this.mods, profiles: profiles};

      if ((options?.autoSelectProfile ?? true) === true && this.mods.profiles[this.mods.selectedProfile] == null) {
        newProfiles.selectedProfile = Object.keys(profiles)[0] ?? ''
      }

      if ((options?.reloadMods ?? true) === true) {
        await Promise.all(Object.keys(profiles).map(async (id) => {
          return await this.reloadMods(id, {save: false, modData: newProfiles});
        }));
      }

      this.setMods(newProfiles);
    }
  }

  // reload the mods associated with the current profile
  async reloadMods(id: string = this.mods.selectedProfile, options?: {
    save?: boolean, // call this.setMods
    modData?: ModContextType // use provided 'modData' instead of this.mods
  }) {
    const response = await handleAxios(() => axios.get(`/server/api/mod/getMods/${id}`));
    const mods = options?.modData ?? this.mods;

    if (id !== '' && response) {
      let files: ModData[] = [...response.data?.data.files];

      const profile: ProfileHolder = { ...mods.profiles };

      profile[id].mods = files;

      if ((options?.save ?? true) === true) {
        this.setMods({
          ...this.mods,
          profiles: profile
        });
      }
    }
  }

  async addMod(data: {
    id?: string,
    files?: AddModData[],
    onUploadProgress?: (data: any) => void,
    autoReload?: boolean, // disable auto calling 'reloadMods' when false (defaults to true)
  }) {
    data.id = data.id ?? this.mods.selectedProfile;
    data.autoReload = data.autoReload ?? true;

    const files = data.files;
    if (files) {
      const formData = new FormData();

      // add data to formData
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i].file, files[i].file.name);
      }

      let mods: {
        fileName: string,
        name?: string,
        description?: string,
        link?: string,
      }[] = files.map((file) => {
        return {
          fileName: file.file.name,
          name: file.name,
          description: file.description,
        }
      })
      const fileData = new Blob([JSON.stringify(mods)], {type: 'application/json'});
      formData.append('fileData', fileData, '');
      formData.append('profileId', data.id);
      
      // create query
      const response = await handleAxios(() => axios.postForm(
        "/server/api/mod/addMod",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          onUploadProgress: data.onUploadProgress
        }
      ));

      if (data.autoReload === true && response?.data?.success === true) {
        await this.reloadMods(data.id);
      }

      return response;
    }
  }

  async removeMod(data: {
    id?: string,
    fileName: string,
    autoReload?: boolean
  }) {
    data.id = data.id ?? this.mods.selectedProfile;
    data.autoReload = data.autoReload ?? true;

    const response = await handleAxios(() => axios.post("/server/api/mod/removeMod", {
      profileId: data.id,
      fileName: data.fileName,
    }));

    if (response?.data?.success === true && data.autoReload === true) {
      await this.reloadMods(data.id);
    } 

    return response;
  }

  async removeAllMods(data: {
    id?: string,
    autoReload?: boolean
  }) {
    data.id = data.id ?? this.mods.selectedProfile;
    data.autoReload = data.autoReload ?? true;
    const profileMods = this.getSelectedProfile()?.mods ?? [];

    await Promise.all(profileMods.map((mod) => {
      return this.removeMod({fileName: mod.fileName, ...data})
    }));

    if (data.autoReload === true) {
      await this.reloadMods(data.id);
    } 
  }
}

export const ModContext = createContext<ModContextState>(new ModContextState(initialModContext, () => {}));

export function ModContextProvider(data: {children: JSX.Element}) {
  const [mods, setMods] = useState(initialModContext);
  const state = new ModContextState(mods, setMods);
  return (
    <ModContext.Provider value={state}>
      {data.children}
    </ ModContext.Provider>
  )
}

// hande axios errors
async function handleAxios<T>(func: () => T) {
  try {
    return await func();
  } catch(err: any) {
    // get the given message from the server if available
    let msg = err?.response?.data?.message ?? err;
    console.error("AXIOS ERROR: ", msg);
  }
}
