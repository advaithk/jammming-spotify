import './App.css';
import SearchApp from './SearchApp/SearchApp';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Ja<span>mmm</span>ing</h1>
        <h3>Search for music, find your jam!</h3>
      </header>
      <body>
        <SearchApp />
      </body>
      <footer>This project uses the Spotify Web API</footer>
    </div>
  );
}

export default App;
