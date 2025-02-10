import logo from './logo.svg';
import './App.css';
import Home from './pages/Home';
import ItemList from './pages/ItemLists';
import ItemDetail from './pages/ItemDetail';
import ItemRegistration from './pages/ItemRegistration';
import ItemEdit from './pages/ItemEdit';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
