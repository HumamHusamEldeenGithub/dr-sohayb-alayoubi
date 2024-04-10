import Client from "../core/client";

const usersRoute = "/users";

async function GetUsers() {
  const response = await Client.get({
    path: `${usersRoute}/users`,
  });
  return response.data;
}

export {
  GetUsers
}