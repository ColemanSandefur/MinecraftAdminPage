import {Alert, Box, Button, LinearProgress, Paper, SpeedDial, SpeedDialAction, SpeedDialIcon, Stack} from "@mui/material";
import {useContext, useEffect, useRef, useState} from "react";
import {ModContext, ModData} from "./modProvider";
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from "@mui/material/IconButton"

function ModItem(data: {modData: ModData}) {
  const modContext = useContext(ModContext);
  
  return (
    <Paper sx={{padding: 1, overflowWrap: "anywhere", display: "flex", alignItems: "center", justifyContent: "space-between"}} elevation={1}>
      {data.modData.name}
      <IconButton onClick={() => modContext.removeMod({fileName: data.modData.name})}>
        <DeleteIcon />
      </IconButton>
    </Paper>
  )
}

export function ModsPage() {
  const modContext = useContext(ModContext);

  let modDisplay = modContext.getSelectedProfile()?.mods.map((val) => <ModItem key={val.name} modData={val} />);

  useEffect(() => {
    modContext.reloadMods();
  }, []);

  return (
    <>
      <Stack sx={{
        padding: 3,
        minWidth: "300px",
        }} spacing={2}>
        { modDisplay }
        { (!modDisplay?.length) && <Alert severity="info">No Mods Found</Alert> }

        <FileSubmission />
      </Stack>
    </>
  );
}

function FileSubmission() {
  const modContext = useContext(ModContext);
  const file = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [fileNames, setFileNames] = useState<string | null>(null);

  const submitFiles = async (event?: React.MouseEvent) => {
    event?.preventDefault();
    setProgress(0);
    await modContext.addMod({
      files: file.current?.files!,
      onUploadProgress: (event) => {setProgress(Math.round(event.loaded / event.total * 100))}
    });
    setProgress(null);
  };

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

  return (
    <>
      {progress && <LinearProgress variant="determinate" value={progress} sx={{height: 10, borderRadius: 5}}/>}
      <input name="files" type="file" id="modFile" ref={file} multiple={true} style={{display:"none"}} onChange={selectedName}/>
      <Box sx={{display:"flex", justifyContent: "space-between", alignContent: "center"}}>
          <Button variant="outlined" onClick={() => file.current?.click()}>
            Choose Files
          </Button>
          <Box component="span" sx={{marginLeft: 1}}>{fileNames}</Box>
        <Button variant="contained" onClick={submitFiles}>
          Submit
        </Button>
      </Box>
      <SpeedDial
        ariaLabel=""
        sx={{position: 'fixed', bottom: 16, right: 16}}
        icon={<SpeedDialIcon />}
      >
        <SpeedDialAction
          onClick={() => modContext.removeAllMods({})} 
          icon={<DeleteIcon />}
          title={'Delete all mods'}
          tooltipTitle={'Delete all mods'}
        />
      </SpeedDial>
    </>
  )
}
