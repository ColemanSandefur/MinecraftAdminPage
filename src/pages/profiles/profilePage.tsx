import {Box, BoxProps, Container, IconButton, Paper, SpeedDial, SpeedDialAction, SpeedDialIcon, Stack} from "@mui/material";
import {useContext, useEffect, useRef, useState} from "react";
import {ModContext, ProfileType} from "../../services/modProvider/modProvider";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import {ProfileDialog} from "./profileSubmit";

function ProfileEntry(props: {profile: ProfileType}) {
  const modContext = useContext(ModContext);
  const Text = (data: BoxProps) => {
    return <Box margin={0} component='p' {...data}>{data.children}</Box>
  }
  const Field = (data: {fieldName: string, children: React.ReactNode}) => {
    if (data.children == null) {
      return <></>
    }

    return <Text><b>{data.fieldName}:</b> {data.children}</Text>
  }

  const title = (<Text fontSize={32}>{props.profile.name}</Text>);

  const SelectButton = () => {
    const currentSelected = (modContext.mods.selectedProfile === props.profile.id);
    const icon = (currentSelected) ? <CheckIcon sx={{color: 'green'}}/> : <AddCircleIcon />;

    return (
      <IconButton aria-label="select profile" onClick={() => modContext.setProfile(props.profile.id)} disabled={currentSelected}>
        {icon}
      </IconButton>
    )
  }

  return (
    <>
      <Paper sx={{padding: 2, overflowWrap: "anywhere", display: "flex", alignItems: "center", justifyContent: "space-between"}} elevation={1}>
        <Box>
          {title}
          <Box margin={0} padding={0.5} component='p' />
          <Field fieldName='id'>{props.profile.id}</Field>
          <Field fieldName='path'>{props.profile.path}</Field>
          <Field fieldName='Mods'>{props.profile.mods.length}</Field>
        </Box>
        <Stack sx={{padding: 0}}>
          <SelectButton />
          <IconButton aria-label="delete profile" onClick={() => modContext.removeProfile(props.profile.id)}>
            <DeleteIcon />
          </IconButton>
        </Stack>
      </Paper>
    </>
  )
}

export function ProfilePage() {
  const modContextRef = useRef(useContext(ModContext));
  const modContext = useContext(ModContext);
  const entries = Object.values(modContext.mods.profiles).map((profile) => {
    return (<ProfileEntry key={profile.id} profile={profile} />)
  });

  useEffect(() => {
    modContextRef.current.reloadProfiles();
  },[])

  const [open, setOpen] = useState(false);

  return (
    <Container maxWidth='md'>
      <Stack spacing={2}>
        {entries}
      </Stack>
      <SpeedDial
        ariaLabel=""
        sx={{position: 'fixed', bottom: 16, right: 16}}
        icon={<SpeedDialIcon />}
      >
        <SpeedDialAction
          icon={<CreateNewFolderIcon />}
          title={'Create Profile'}
          tooltipTitle={'Create Profile'}
          onClick={() => setOpen(true)}
        />
      </SpeedDial>
      <ProfileDialog open={open} setOpen={setOpen} />
    </Container>
  )
}
