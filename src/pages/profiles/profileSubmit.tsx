import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import {useContext, useRef} from "react";
import {ModContext} from "../../services/modProvider/modProvider";

export function ProfileDialog(props: {open: boolean, setOpen: (set: boolean) => void}) {
  const modContext = useContext(ModContext);
  const id = useRef<HTMLInputElement>(null);
  const name = useRef<HTMLInputElement>(null);
  const path = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    props.setOpen(false);
  }

  const handleSubmit = () => {
    if (id.current?.value && name.current?.value &&  path.current?.value) {
      modContext.createProfile({
        id: id.current.value,
        name: name.current.value,
        path: path.current.value,
      });
    }
    handleClose();
  }

  return (
    <Dialog open={props.open} onClose={handleClose}>
      <DialogTitle>Profile Creation</DialogTitle>
      <DialogContent>
        <TextField id="id" label="Id" margin="dense" fullWidth inputRef={id}/>
        <TextField id="name" label="Name" margin="dense" fullWidth inputRef={name}/>
        <TextField id="path" label="Path" margin="dense" fullWidth inputRef={path}/>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  )
}
