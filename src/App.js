import "./App.css";
import Dashboard from "./components/Dashboard";
import { useState, useEffect } from "react";
import Client from "./core/client";
import Cookies from "universal-cookie";
import Login from "./components/Authorization/Login";
import { ConfigProvider } from "antd";

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
    <ConfigProvider
      theme={{
        token: {
          colorPrimary:
            "linear-gradient(112deg, rgba(7,38,78,1) 0%, rgba(34,62,97,1) 99%)",
        },
      }}
    >
      <Dashboard />
    </ConfigProvider>
  );
}

export default App;
