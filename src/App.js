
import './App.css';
import Dashboard from './components/Dashboard';
import { useState, useEffect } from "react";
import Client from "./core/client";
import Cookies from "universal-cookie";
import Login from './components/Authorization/Login';



function App() {

  const [token, setToken] = useState(null);

  useEffect(() => {
    const cookies = new Cookies();
    const token = cookies.get("token");
    if (token) {
      setToken(token);
      Client.setHeader("Authorization", `Bearer ${token}`);
    }
  }, []);

  if (!token) {
    return <Login setToken={setToken} />;
  }

  return (
    <div className="App">
      <Dashboard/>
    </div>
  );
}

export default App;
