import './App.css';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/home/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Events from './pages/event/Event';
import Navigation from './component/Navigation';
import { UserProvider } from './context/AuthContext';
import Bookings from './pages/booking/Booking';

function App() {
  return (
    <div className="App">
      <UserProvider>
        <BrowserRouter>
          <React.Fragment>
            <Navigation />
            <Routes>
              <Route path="/" Component={Home} />
              <Route path="/login" Component={Login} />
              <Route path="/register" Component={Register} />
              <Route path="/event" Component={Events} />
              <Route path="/booking" Component={Bookings} />
            </Routes>
          </React.Fragment>
        </BrowserRouter>
      </UserProvider>
    </div>
  );
}

export default App;
