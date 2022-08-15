import {Alert, Box, Paper, SpeedDial, SpeedDialAction, SpeedDialIcon, Stack} from "@mui/material";
import {useContext, useEffect} from "react";
import {ModContext, ModData} from "../../services/modProvider";
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from "@mui/material/IconButton";
import { FileSubmission } from "./fileSubmission";

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
        {/* Just a buffer at the bottom for the action button */}
        <Box height={50}/>
      </Stack>
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
  );
}