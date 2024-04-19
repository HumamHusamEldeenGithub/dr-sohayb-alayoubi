import { Layout, Menu } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
const { Header } = Layout;

export default function HeaderHome() {
  const navigate = useNavigate();
  const [selectedKey, setSelectedKey] = useState("/");

  function getItem(label, key, icon, children) {
    return {
      key,
      icon,
      children,
      label,
      onClick: ({ key }) => {
        navigate(key);
        setSelectedKey(key);
      },
    };
  }

  const items = [getItem("Dashboard", "/"), getItem("Users", "/users")];

  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <LogoDiv>
        <LogoImage
          src={"header_logo.png"}
          alt="logo"
          onClick={() => {
            navigate("/");
            setSelectedKey("/");
          }}
        />
      </LogoDiv>
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={["/"]}
        selectedKeys={[selectedKey]}
        items={items}
        style={{
          flex: 1,
          minWidth: 0,
        }}
      />
    </Header>
  );
}

const LogoDiv = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const LogoImage = styled.img`
  height: 100%;
`;
