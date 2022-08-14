import {useContext, useEffect, useRef, useState} from "react";
import {ModContext} from "./modProvider";

export function ModsPage() {
  const modContext = useContext(ModContext);
  const file = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);

  let modDisplay = modContext.getSelectedProfile()?.mods.map((val) => <p key={val.name}>{val.name}</p>);

  useEffect(() => {
    modContext.reloadMods();
  }, []);

  const submitFiles = async (event?: React.MouseEvent) => {
    event?.preventDefault();
    setProgress(0);
    await modContext.addMod({
      files: file.current?.files!,
      onUploadProgress: (event) => {setProgress(Math.round(event.loaded / event.total * 100))}
    });
    setProgress(null);
  };

  return (
    <>
      {progress && <h3>Uploading: {progress}%</h3>}
      { modDisplay }
      <form action="http://localhost:8000/api/addMod" method="post" encType="multipart/form-data">
        <input name="files" type="file" id="modFile" ref={file} multiple={true}/>
        <button type="submit" onClick={submitFiles}>
          Submit
        </button>
      </form>
    </>
  );
}
