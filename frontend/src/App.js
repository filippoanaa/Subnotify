import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import SubscriptionsList from './components/SubscriptionsList';
import LogIn from './components/LogIn';
import AddUser from './components/AddUser';
import AddSubscription from './components/AddSubscription';
import UpdateUser from './components/UpdateUser'; 
import NavBar from './components/NavBar'; 

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';

function App() {
  const [userId, setUserId] = useState(null); 

  const handleLogin = (id) => {
    setUserId(id); 
  };

  const handleLogout = () => {
    setUserId(null); 
  };

  return (
      <Router>
        <NavBar userId={userId} onLogout={handleLogout} />
        <div className="container">
          <Routes>
            <Route 
              path="/" 
              element={<LogIn onLogin={handleLogin} />} 
            />
            <Route path="/signup" element={<AddUser onLogin={handleLogin} />} />
            <Route path="/users/:userId/subscriptions" element={<SubscriptionsList />} />
            <Route path="/users/:userId/subscriptions/add" element={<AddSubscription />} />
            <Route 
              path="/users/:userId/subscriptions/:subscriptionId/edit" 
              element={<AddSubscription />} 
            />
            <Route path="/users/:userId/settings" element={<UpdateUser />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;