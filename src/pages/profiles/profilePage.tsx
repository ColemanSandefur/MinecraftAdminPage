import {Box, BoxProps, List, Paper} from "@mui/material";
import {useContext, useEffect} from "react";
import {ModContext, ProfileType} from "../../services/modProvider/modProvider";

function ProfileEntry(props: {profile: ProfileType}) {
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
      </Paper>
    </>
  )
}

export function ProfilePage() {
  const modContext = useContext(ModContext);
  const entries = Object.values(modContext.mods.profiles).map((profile) => {
    return (<ProfileEntry key={profile.id} profile={profile} />)
  });

  useEffect(() => {
    modContext.reloadProfiles();
  },[])

  return (
    <>
      <List>
        {entries}
      </List>
    </>
  )
}
