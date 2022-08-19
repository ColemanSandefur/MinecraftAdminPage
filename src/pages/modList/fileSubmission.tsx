import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, TextField, TextFieldProps} from "@mui/material";
import {Stack} from "@mui/system";
import {useContext, useEffect, useRef, useState} from "react";
import {AddModData, ModContext} from "../../services/modProvider/modProvider";
import { Delay } from "../../util/components/delay";
import { HybridLinear } from "../../util/components/liearProgress";
import { Modify } from "../../util/util";

type ModHolder = Modify<AddModData, {
  file?: File
}>;

export function ModEntry(data: {mod: ModHolder, setMod: (mod: ModHolder, modId: number) => void, modId: number, removeMod: (modId: number) => void, showDelete?: boolean}) {
  const file = useRef<HTMLInputElement>(null);
  const description = useRef<HTMLInputElement>(null);
  const name = useRef<HTMLInputElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const [fileNames, setFileNames] = useState<string | null>(null);

  const selectedName = () => {
    const files = file.current?.files!;
    const numFiles = file.current?.files?.length ?? 0;
    if (numFiles > 1) {
      setFileNames(`${numFiles} selected`);
    } else if (numFiles == 1) {
      setFileNames(files.item(0)!.name);
    } else {
      setFileNames(null);
    }
  }

  const valueChange = () => {
    // convert a falsey value (ex: '') to undefined
    const nullStr = (value: any) => value || undefined;

    const newMod: ModHolder = {
      file: file.current?.files?.[0],
      name: nullStr(name.current?.value),
      description: nullStr(description.current?.value),
    };

    data.setMod(newMod, data.modId);
  }

  const MyTextField = (props: TextFieldProps) => {
    const onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      props.onChange?.(event);
      valueChange();
    }
    return <TextField {...props} onChange={onChange} />
  }

  return (
    <form ref={form}>
      <input name="files" type="file" id="modFile" ref={file} style={{display:"none"}} onChange={() => {selectedName(); valueChange();}} />
      <Box component="span">
        <Button variant="outlined" onClick={() => file.current?.click()}>
          Choose File
        </Button>
        <Box component="span" ml={2}>
          {fileNames}
        </Box>
      </Box>
      <MyTextField id="name" label="Name" margin="dense" fullWidth inputRef={name} defaultValue={data.mod.name}/>
      <MyTextField id="description" label="Description" margin="dense" fullWidth inputRef={description} defaultValue={data.mod.description} />
      {data.showDelete === true && <Button onClick={() => data.removeMod(data.modId)}>Remove</Button> }
    </form>
  )
}

export function UploadDialog(data: {open: boolean, setOpen: (state: boolean) => void}) {

  //
  // Hooks
  //

  const modContext = useContext(ModContext);
  const [progress, setProgress] = useState<number | null>(null);
  const [mods, setMods] = useState<ModHolder[]>([{}, {}]); // Create list of mods

  useEffect(() => {
    setProgress(null);
    setMods([{}]);
  }, [data.open])

  //
  // Functions
  //

  // used to close popup
  const handleClose = () => {
    data.setOpen(false);
  };

  const setMod = (newMod: ModHolder, idx: number) => {
    mods[idx] = newMod;
  }
  const addNewMod = () => {
    setMods([...mods, {}]);
  }
  const removeMod = (idx?: number) => {
    idx = idx ?? Math.max(mods.length - 1, 0);

    if (idx != null && idx < mods.length) {
      const newMods = [...mods];
      newMods.splice(idx, 1);
      setMods(newMods);
    }

    console.log('newMods:', mods);
  }

  const submitFiles = async (event?: React.MouseEvent) => {
    setMods(mods);
    event?.preventDefault();
    setProgress(0);

    // reorganize the data to work with addMod
    let submitMods: AddModData[] = [];
    mods.forEach((value) => {
      if (value.file) {
        submitMods.push({
          file: value.file,
          ...value
        });
      }
    });

    await modContext.addMod({
      files: submitMods,
      onUploadProgress: (event) => {setProgress(Math.round(event.loaded / event.total * 100))}
    });
    setProgress(null);
    handleClose();
  };

  let modElements = mods.map((mod, idx) => <ModEntry key={idx} modId={idx} mod={mod} setMod={setMod} removeMod={removeMod} showDelete={mods.length > 1}/>);

  return (
    <Dialog open={data.open} onClose={() => data.setOpen(false)}>
      <DialogTitle>Upload File</DialogTitle>
      <DialogContent>
        <Stack divider={<Divider orientation="horizontal" />} spacing={2} >
          {modElements}
        </Stack>
        {progress != null && <Delay><HybridLinear variant='big' value={progress} /></Delay>}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={addNewMod}>New</Button>
        <Button onClick={submitFiles}>Upload</Button>
      </DialogActions>
    </Dialog>
  )
}
