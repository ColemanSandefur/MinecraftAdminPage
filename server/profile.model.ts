import {ModManager} from "./routes/api/mod/modManager";

export interface Profile {
  id: string;
  path: string;
  name: string;
  manager: ModManager;
}
