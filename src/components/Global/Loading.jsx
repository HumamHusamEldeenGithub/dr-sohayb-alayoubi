import { Flex } from "antd";
import styled from "styled-components";

export default function LoadingPage({ loadingCaption }) {
  return (
    <Flex vertical justify="center" align="center" style={{ height: "100vh" }}>
      <LogoDiv>
        <img
          alt="logo"
          src="main_logo2.png"
          style={{
            borderRadius: 10,
            width: "100%",
            objectFit: "contain",
          }}
        />
      </LogoDiv>
      <Flex justify="center" align="center">
        <div class="lds-roller">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <h3 style={{ marginLeft: 20 }}>{loadingCaption}</h3>
      </Flex>
    </Flex>
  );
}

const LogoDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 500px;
  max-width: 80vw;
  margin-bottom: 20px;
`;
