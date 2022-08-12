import React, {useRef} from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

function App() {
  const file = useRef<HTMLInputElement>(null);
  const form = useRef<HTMLFormElement>(null);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <form action="http://localhost:8000/api/addMod" method="post" encType="multipart/form-data" ref={form}>
          <input name="files" type="file" id="modFile" ref={file}/>
          <button type="submit" onClick={(event) => {
              console.log(event);
              event.preventDefault();
              console.log(form.current);
              let formData = new FormData(form.current!);
              formData.append("profileId", "someRandomID");
              axios.postForm("http://localhost/server/api/addMod", formData, {headers: {"Content-Type": "multipart/form-data"}});
            }}>
            Submit
          </button>
        </form>
      </header>
    </div>
  );
}

export default App;
