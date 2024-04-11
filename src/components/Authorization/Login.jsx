import { useState } from "react";
import { Button, Checkbox, Form, Input, Space } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { decodeToken } from "react-jwt";
import styled from "styled-components";
import Cookies from "universal-cookie";
import { SubmitLogin } from "../../repository/auth";

export default function Login({ setToken }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const onFinish = async (values) => {
    setErrorMsg(null);
    setLoading(true);
    const username = values.username.trim();
    SubmitLogin({
      username: username,
      password: values.password,
    })
      .then((response) => {
        // const decodedToken = decodeToken(res.token);
        // const decodedRefreshToken = decodeToken(res.refreshToken);

        const cookies = new Cookies();
        cookies.set("token", response.token, {
          path: "/",
          maxAge: 3600 * 3,
        });
        cookies.set("username", username, { path: "/", maxAge: 3600 * 3 });
        setToken(response.token);
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
  return (
    <LoginPage>
      <LoginWrapper>
        <img alt="logo" src="logo.png" style={{ width: "100%" }} />
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            size="large"
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your Username!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: "#1890FF" }} />}
                placeholder="Username"
              />
            </Form.Item>
            <Space
              direction="vertical"
              size="small"
              style={{ width: "100%", position: "relative" }}
            >
              <Form.Item
                style={{ marginBottom: 10 }}
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your Password!",
                  },
                ]}
              >
                <Input
                  prefix={<LockOutlined style={{ color: "#1890FF" }} />}
                  type="password"
                  placeholder="Password"
                />
              </Form.Item>
              {errorMsg && (
                <ErrorMessage style={{ color: "red" }}>
                  {errorMsg.message}
                </ErrorMessage>
              )}
            </Space>
            <Form.Item>
              <Button
                loading={loading}
                type="primary"
                htmlType="submit"
                style={{ width: "100%", marginTop: "20px" }}
              >
                Sign in
              </Button>
            </Form.Item>
          </Form>
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
