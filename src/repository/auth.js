import Client from "../core/client";

const authRoute = "/auth";

async function SubmitLogin({ username, password }) {
  const response = await Client.post({
    path: `${authRoute}/login`,
    payload: {
      username: username,
      password: password,
    },
  });
  return response.data;
}

async function SubmitLoginWithRefreshToken({ refreshToken }) {
  const response = await Client.post({
    path: `${authRoute}/login/refresh-token`,
    payload: {
      refreshToken: refreshToken,
    },
  });
  return response.data;
}

async function RegisterUser({ username, password, role }) {
  const response = await Client.post({
    path: `${authRoute}/register`,
    payload: {
      username: username,
      password: password,
      role: role,
    },
  });
  return response.data;
}

export { SubmitLogin, SubmitLoginWithRefreshToken, RegisterUser };
