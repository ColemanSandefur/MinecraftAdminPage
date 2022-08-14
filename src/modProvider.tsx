import React, {createContext, useState} from "react";
import axios from "axios";

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

interface ModContextState {
  mods: ModContextType;
  setMods: SetState<ModContextType>;
}

interface ModContextType {
  profiles: {
    [id: string]: ProfileType
  },
  selectedProfile: string,
}

interface ProfileType {
  mods: {
    name: string
  }[]
}

const initialModContext: ModContextType = {
  profiles: {},
  selectedProfile: 'someRandomID',
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

  async reloadMods(id: string = this.mods.selectedProfile) {
    const response = await handleAxios(() => axios.get(`http://localhost/server/api/getMods/${id}`));

    if (response) {
      let files: string[] = [...response.data?.data.files];

      const profile = {
        mods: files.map((val) => ({name: val}))
      };

      this.setMods({
        ...this.mods,
        profiles: {
          someRandomID: profile,
        },
      });
    }
  }

  async addMod(data: {
    id?: string,
    files?: FileList,
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
        formData.append('files', files[i], files[i].name);
      }
      formData.append('profileId', data.id);
      
      // create query
      const response = await handleAxios(() => axios.postForm(
        "http://localhost/server/api/addMod",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          onUploadProgress: data.onUploadProgress
        }
      ));

      if (data.autoReload == true && response?.data?.success === true) {
        await this.reloadMods(data.id);
      }

      return response;
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
    console.error(msg);
  }
}
