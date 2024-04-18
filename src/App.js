import "./App.css";
import Dashboard from "./components/Dashboard";
import { ConfigProvider } from "antd";

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary:
            "linear-gradient(112deg, rgba(7,38,78,1) 0%, rgba(34,62,97,1) 99%)",
        },
        components: {
          Select: {
            optionSelectedBg:"#e6f4ff"
          },
        },
      }}
    >
      <Dashboard />
    </ConfigProvider>
  );
}

export default App;
