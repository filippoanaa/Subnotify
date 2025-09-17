import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import SubscriptionsList from './components/SubscriptionsList';
import LogIn from './components/LogIn';
import AddAppUser from './components/AddAppUser';
import AddSubscription from './components/AddSubscription';
import UpdateAppUser from './components/UpdateAppUser'; 
import NavBar from './components/NavBar'; 

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';

function App() {
  const [userId, setAppUserId] = useState(null); 

  const handleLogin = (id) => {
    setAppUserId(id); 
  };

  const handleLogout = () => {
    setAppUserId(null); 
  };

  return (
      <Router>
        <NavBar userId={userId} onLogout={handleLogout} />
        <div className="container">
          <Routes>
            <Route 
              path="/login" 
              element={<LogIn onLogin={handleLogin} />} 
            />
            <Route path="/signup" element={<AddAppUser onLogin={handleLogin} />} />
            <Route path="/users/:userId/subscriptions" element={<SubscriptionsList />} />
            <Route path="/users/:userId/subscriptions/add" element={<AddSubscription />} />
            <Route 
              path="/users/:userId/subscriptions/:subscriptionId/edit" 
              element={<AddSubscription />} 
            />
            <Route path="/users/:userId/settings" element={<UpdateAppUser />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;