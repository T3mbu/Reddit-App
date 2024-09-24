// src/App.js

import React from 'react';
import './App.css';
import Posts from './components/Posts';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Reddit App</h1>
      </header>
      <main>
        <Posts />  {/* Render the Posts component */}
      </main>
    </div>
  );
}

export default App;
