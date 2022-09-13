import React from 'react';
import logo from './logo.svg';
import './App.css';
// import { listenerCount } from 'process';

const list = [1,2,3,4,5]

function App() {
  return (
    <div>
      {list.map(el => (
        <h1 key={el}>{el}</h1>
      ))}
    </div>

    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       123Edit <code>src/App.tsx</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;
