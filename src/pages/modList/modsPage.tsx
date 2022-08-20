import {Alert, Box, Container, Paper, SpeedDial, SpeedDialAction, SpeedDialIcon, Stack} from "@mui/material";
import {useContext, useState} from "react";
import {ModContext, ModData} from "../../services/modProvider/modProvider";
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from "@mui/material/IconButton";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { UploadDialog } from "./fileSubmission";
import {safe} from "../../util/util";
import {BoxProps} from "@mui/system";

function ModItem(data: {modData: ModData}) {
  const modContext = useContext(ModContext);

  const Text = (data: BoxProps) => {
    return <Box margin={0} component='p' {...data}>{data.children}</Box>
  }

  const title = (<Text fontSize={32}>{data.modData.name || data.modData.fileName}</Text>);
  
  const body = safe(() => {
    const bodyData = [];

    const Field = (data: {fieldName: string, children: React.ReactNode}) => {
      return <Text><b>{data.fieldName}:</b> {data.children}</Text>
    }

    // fileName will be the title if name isn't present, so only display when name is present
    if (data.modData.name && data.modData.fileName) {
      bodyData.push(<Field key="File Name" fieldName='File Name'>{data.modData.fileName}</Field>);
    }

    if (data.modData.description) {
      bodyData.push(<Field key="description" fieldName='Description'>{data.modData.description}</Field>);
    }

    return bodyData;
  })!;
  
  return (
    <Paper sx={{padding: 2, overflowWrap: "anywhere", display: "flex", alignItems: "center", justifyContent: "space-between"}} elevation={1}>
      <Box>
        <Stack spacing={1}>
          {title}
          {title && body.length > 0 && <Box margin={0} padding={0.5} component='p' />}
          {body}
        </Stack>
      </Box>
      <Stack>
        <IconButton onClick={() => modContext.removeMod({fileName: data.modData.fileName})}>
          <DeleteIcon />
        </IconButton>
      </Stack>
    </Paper>
  )
}

export function ModsPage() {
  const modContext = useContext(ModContext);
  const [open, setOpen] = useState(false);

  let modDisplay = modContext.getSelectedProfile()?.mods.map((val) => <ModItem key={val.fileName} modData={val} />);

  return (
    <Container maxWidth="md">
        <Stack sx={{
          }} spacing={2}>
          { modDisplay }
          { (!modDisplay?.length) && <Alert severity="info">No Mods Found</Alert> }

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
          <SpeedDialAction
            icon={<FileUploadIcon />}
            title={'Upload mod'}
            tooltipTitle={'Upload mod'}
            onClick={() => setOpen(true)}
          />
        </SpeedDial>
        <UploadDialog open={open} setOpen={setOpen} />
    </Container>
  );
}
