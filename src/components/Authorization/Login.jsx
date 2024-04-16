import { useState } from "react";
import { Button, Input, Space } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import styled from "styled-components";
import Cookies from "universal-cookie";
import { SubmitLogin } from "../../repository/auth";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onFinish = async (values) => {
    setErrorMsg(null);
    setLoading(true);

    SubmitLogin({
      username: username.trim(),
      password: password,
    })
      .then((response) => {
        const cookies = new Cookies();
        cookies.set("token", response.token, {
          path: "/",
          maxAge: 3600 * 3,
        });
        cookies.set("refreshToken", response.refreshToken, {
          path: "/",
          maxAge: 3600 * 30,
        });
        cookies.set("username", username, { path: "/", maxAge: 3600 * 3 });
        window.location.reload();
      })
      .catch((error) => {
        var errorBody = "";
        if (error.response && error.response.data)
          errorBody = error.response.data;
        else errorBody = { message: "an error has occured, please try again" };

        onFinishFailed(errorBody);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const onFinishFailed = (errorInfo) => {
    console.error("Failed:", errorInfo);
    setErrorMsg(errorInfo);
  };

  const handleSubmit = async (values) => {
    try {
      await onFinish(values);
    } catch (errorInfo) {
      onFinishFailed(errorInfo);
    }
  };


  return (
    <LoginPage>
      <LoginWrapper>
        <img alt="logo" src="main_logo2.png" className="login-logo" />
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Input
            prefix={<UserOutlined style={{ color: "#1890FF" }} />}
            placeholder="Username"
            name="password"
            required
            style={{ fontSize: "1.2em", fontFamily: "bold" }}
            onChange={(e) => setUsername(e.target.value)}
            onPressEnter={handleSubmit}
          />
          <Space
            direction="vertical"
            size="small"
            style={{ width: "100%", position: "relative" }}
          >
            <Input
              prefix={<LockOutlined style={{ color: "#1890FF" }} />}
              type="password"
              placeholder="Password"
              style={{ fontSize: "1.2em", fontFamily: "bold" }}
              onChange={(e) => setPassword(e.target.value)}
              onPressEnter={handleSubmit}
            />

            {errorMsg && (
              <ErrorMessage style={{ color: "red" }}>
                {errorMsg.message}
              </ErrorMessage>
            )}
          </Space>
          <Button
            loading={loading}
            type="primary"
            style={{
              width: "100%",
            }}
            onClick={handleSubmit}
          >
            Sign in
          </Button>
        </Space>
      </LoginWrapper>
    </LoginPage>
  );
}

const LoginPage = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoginWrapper = styled.div`
  max-width: 80vw;
`;

const ErrorMessage = styled.p`
  display: flex;
  justify-content: end;
  margin: 0;
  font-weight: bold;
`;
