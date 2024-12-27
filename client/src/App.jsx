// src/App.js
// import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ItineraryForm from './components/ItineraryForm';
import ItineraryList from './components/ItineraryList';
import './App.css';
import SignUp from './components/SignUp';
import Login from './components/login';
import DayForm from './components/DayForm';
import Activity from './components/Activity';

function App() {
  return (
    <Router>
      <div className="App">
        
        <Routes>  
          <Route path="/create" element={<ItineraryForm />} />
          <Route path="/itineraries" element={<ItineraryList />} />
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/add-day/:itineraryId" element={<DayForm />} />
          <Route path="/activity/:dayId" element={<Activity/>} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;