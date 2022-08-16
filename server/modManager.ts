import path from 'path';
import {moveFile, readDir, readFile, removeFile, writeFile} from "./util/myFs";
import {safe} from './util/util';

export interface Mod {
  fileName: string;
}

interface ManagerMetadata {
  mods: {[fileName: string]: Mod};
}

export class ModManager {
  directory: string;
  managerData?: ManagerMetadata;

  constructor(directory: string) {
    this.directory = directory;
  }

  managerPath() {
    return path.join(this.directory, '.modManagerData')
  }

  async loadModsDir() {
    const managerPath = this.managerPath();
    this.managerData = {mods: {}};
    let oldManager: ManagerMetadata | undefined;

    try {
      oldManager = JSON.parse(await readFile(managerPath));
    } catch {}

    this.managerData!.mods = {};

    let modFiles = await readDir(this.directory);

    // update/initialize managerData to the contents of the directory
    for (const fileName of modFiles) {
      if (oldManager?.mods[fileName] == null) {
        this.managerData!.mods[fileName] = {
          fileName: fileName,
        }
      } else if (oldManager?.mods[fileName] != null) {
        this.managerData!.mods[fileName] = oldManager.mods[fileName];
      }
    }

    // remove unwanted files
    delete this.managerData?.mods['.modManagerData'];

    await this.saveMetadata();
  }

  async saveMetadata() {
    await writeFile(this.managerPath(), JSON.stringify(this.managerData!, null, "\t"));
  }

  async addMod(mod: Mod, options: {oldPath?: string, autoSave?: boolean}) {
    if (this.managerData) {
      this.managerData.mods[mod.fileName] = mod;
    }

    if (options.oldPath) {
      await moveFile(options.oldPath, path.join(this.directory, mod.fileName));
    }

    if (options.autoSave ?? true === true) {
      await this.saveMetadata();
    }
  }
  
  async removeMod(modName: string, options: {autoSave?: boolean} = {autoSave: true}) {
    delete this.managerData?.mods[modName];

    await safe(() => removeFile(path.join(this.directory, modName)));

    if (options.autoSave ?? true === true) {
      await this.saveMetadata();
    }
  }
}
