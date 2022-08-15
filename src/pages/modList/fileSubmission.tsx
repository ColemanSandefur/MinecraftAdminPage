import {Box, Button} from "@mui/material";
import {useContext, useRef, useState} from "react";
import {ModContext} from "../../services/modProvider";
import { Delay } from "../../util/components/delay";
import { HybridLinear } from "../../util/components/liearProgress";

export function FileSubmission() {
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
      {progress != null && <Delay><HybridLinear variant='big' value={progress} /></Delay>}
      <input name="files" type="file" id="modFile" ref={file} multiple={true} style={{display:"none"}} onChange={selectedName}/>
      <Box sx={{display:"flex", justifyContent: "space-between", alignContent: "center"}}>
        <Button variant="outlined" onClick={() => file.current?.click()}>
          Choose Files
        </Button>
        <Box component="span">{fileNames}</Box>
        <Button variant="contained" onClick={submitFiles}>
          Submit
        </Button>
      </Box>
    </>
  )
}