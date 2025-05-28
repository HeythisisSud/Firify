import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './component/Auth';
import Home from './component/Home';
import { useState } from 'react';
import './index.css';
import {createContext } from 'react';
import {UserContext} from './context/UserContext'
import  ProtectedRoute  from './component/ProtectedRoute'

function App() {
  const [user,setUser]=useState('')
  return (
    <UserContext.Provider value={{user,setUser}}>
  <Router>
    <Routes>
      <Route path="/" element={<Auth />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute user={user}>
              <Home />
            </ProtectedRoute>
          }
        />    
    </Routes>
  </Router>

    </UserContext.Provider>
  );
}

export default App;
