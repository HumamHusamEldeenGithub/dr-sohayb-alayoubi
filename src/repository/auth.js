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


export {
    SubmitLogin
}