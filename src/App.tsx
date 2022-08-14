import './App.css';
import {ModContextProvider} from './modProvider';
import {ModsPage} from './Mods';

function App() {
  return (
    <ModContextProvider>
      <div className="App">
        <header className="App-header">
          <ModsPage />
        </header>
      </div>
    </ModContextProvider>
  );
}

export default App;
