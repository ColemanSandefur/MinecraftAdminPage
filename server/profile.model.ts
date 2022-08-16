import {ModManager} from "./modManager";

export interface Profile {
  id: string;
  path: string;
  name: string;
  manager: ModManager;
}
