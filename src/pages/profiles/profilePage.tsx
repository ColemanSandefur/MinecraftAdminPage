import {Box, BoxProps, IconButton, List, Paper, Stack} from "@mui/material";
import {useContext, useEffect, useRef} from "react";
import {ModContext, ProfileType} from "../../services/modProvider/modProvider";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CheckIcon from '@mui/icons-material/Check';

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
      <IconButton onClick={() => modContext.setProfile(props.profile.id)} disabled={currentSelected}>
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
        <List>
          <SelectButton />
        </List>
      </Paper>
    </>
  )
}

export function ProfilePage() {
  const modContext = useRef(useContext(ModContext));
  const entries = Object.values(modContext.current.mods.profiles).map((profile) => {
    return (<ProfileEntry key={profile.id} profile={profile} />)
  });

  useEffect(() => {
    modContext.current.reloadProfiles();
  },[])

  return (
    <>
      <Stack spacing={2}>
        {entries}
      </Stack>
    </>
  )
}
