import { Layout as AntLayout } from "antd";
import styled from "styled-components";
import HeaderHome from "./Header";
import { Route, Routes, Navigate } from "react-router-dom";
import CalendarPanel from "./CalendarPanel";
import UsersPanel from "./UsersPanel";

export default function Dashboard() {
  return (
    <AntLayout>
      <HeaderHome />
        <AntLayout>
          <Routes>
            <Route path="/" element={<CalendarPanel/>} />
            <Route path="/users" element={<UsersPanel/>} />
            <Route path='*' element={<Navigate to='/' />} />
          </Routes>
        </AntLayout>
    </AntLayout>
  );
}

