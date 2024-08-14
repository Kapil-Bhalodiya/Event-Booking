import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/login';
import React from 'react';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={Login} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
