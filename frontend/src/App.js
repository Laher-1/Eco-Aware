import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import MainRoutes from './routing/MainRoutes';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <MainRoutes />
      </div>
    </Router>
  );
}

export default App;