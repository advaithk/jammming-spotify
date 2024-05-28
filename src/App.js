import logo from './images/logo.svg';
import './App.css';
import SearchApp from './SearchApp/SearchApp';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>Ja<span>mmm</span>ing</h2>
      </header>
      <SearchApp />

      <footer>This project uses the Spotify Web API</footer>
    </div>
  );
}

export default App;
