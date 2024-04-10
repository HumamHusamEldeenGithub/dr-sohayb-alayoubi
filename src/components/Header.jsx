import { Layout, Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
const { Header } = Layout;

export default function HeaderHome() {
  const navigate = useNavigate();
  const location = useLocation();

  function getItem(label, key, icon, children) {
    return {
      key,
      icon,
      children,
      label,
      onClick: ({ key }) => navigate(key),
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
        <LogoImage src={"logo_header.png"} alt="logo" onClick={()=>navigate("/")}/>
      </LogoDiv>
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={["/"]}
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
  margin-right: 10px;
  cursor: pointer;
`;

const LogoImage = styled.img`
height: 80%;
margin:autopx;
border-radius: 5px;
`;