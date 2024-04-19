import { Layout as AntLayout } from "antd";
import HeaderHome from "./Global/Header";
import { Route, Routes, Navigate } from "react-router-dom";
import CalendarPanel from "./Appointments/CalendarPanel";
import UsersPanel from "./Users/UsersPanel";
import Login from "./Authorization/Login";
import { useState, useEffect } from "react";
import Client from "../core/client";
import Cookies from "universal-cookie";
import LoadingPage from "./Global/Loading";
import { SubmitLoginWithRefreshToken } from "../repository/auth";

const modes = {
  Loading: "LOADING",
  Login: "LOGIN",
  Dashboard: "DASHBOARD",
};

export default function Dashboard() {
  const [mode, setMode] = useState(modes.Login);

  useEffect(() => {
    const cookies = new Cookies();
    const token = cookies.get("token");
    const refreshToken = cookies.get("refreshToken");
    if (token) {
      Client.setHeader("Authorization", `Bearer ${token}`);
      setMode(modes.Dashboard);
    } else if (refreshToken) {
      setMode(modes.Loading);
      cookies.remove("refreshToken");
      SubmitLoginWithRefreshToken({
        refreshToken: refreshToken,
      })
        .then((response) => {
          cookies.set("token", response.token, {
            path: "/",
            maxAge: 3600 * 3,
          });
          cookies.set("refreshToken", response.refreshToken, {
            path: "/",
            maxAge: 3600 * 30,
          });
          window.location.reload();
        })
        .catch((error) => {
          console.error(error);
          window.location.reload();
        });
    }
  }, []);

  switch (mode) {
    case modes.Login:
      return <Login setMode={setMode} />;
    case modes.Loading:
      return <LoadingPage loadingCaption={"Getting a new token"} />;
    default:
      console.error("unsupported mode");
  }

  return (
    <AntLayout>
      <HeaderHome />
      <AntLayout>
        <Routes>
          <Route path="/" element={<CalendarPanel />} />
          <Route path="/users" element={<UsersPanel />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AntLayout>
    </AntLayout>
  );
}
