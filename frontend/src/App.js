import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import SubscriptionsList from './components/SubscriptionsList';
import LogIn from './components/LogIn';
import AddAppUser from './components/AddAppUser';
import AddSubscription from './components/AddSubscription';
import UpdateAppUser from './components/UpdateAppUser';
import NavBar from './components/NavBar';
import {useNavigate} from "react-router-dom";
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import {use, useEffect, useState} from 'react';

function App() {
  const [userId, setUserId] = useState(null  );

  const handleLogin = (id) => {
    setUserId(id);
  };

  useEffect(() => {
    const userRaw = localStorage.getItem("user");
    if (userRaw) {
      const userData = JSON.parse(userRaw);
      setUserId(userData.id);
    } else {
      setUserId(null);
    }
  }, []);

  const handleLogout = () => {
    setUserId(null);
    localStorage.removeItem("user");
    localStorage.removeItem("jwt");
  };



  return (
      <Router>
        <NavBar userId={userId} onLogout={handleLogout} />
        <div className="container">
          <Routes>
            {/* Redirect de la / la login */}
            <Route path="/" element={<Navigate to="/subnotify/login" replace />} />

            <Route
                path="/subnotify/login"
                element={<LogIn onLogin={handleLogin} />}
            />
            <Route path="/subnotify/signup" element={<AddAppUser onLogin={handleLogin} />} />
            <Route path="/subnotify/your-subscriptions" element={<SubscriptionsList />} />
            <Route path="/subnotify/add-subscription" element={<AddSubscription />} />
            <Route
                path="/subnotify/your-subscriptions/:subscriptionId"
                element={<AddSubscription />}
            />
            <Route path="/subnotify/settings" element={<UpdateAppUser />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;