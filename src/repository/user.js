import Client from "../core/client";

const usersRoute = "/users";

async function GetUsers() {
  const response = await Client.get({
    path: `${usersRoute}`,
  });
  return response.data;
}

async function UpdateUser({id,password}) {
  const response = await Client.patch({
    path: `${usersRoute}/${id}`,
    payload: {
      password: password
    }
  });
  return response.data;
}

async function DeleteUser({id}) {
  const response = await Client.delete({
    path: `${usersRoute}/${id}`,
  });
  return response.data;

}


export {
  GetUsers,
  UpdateUser,
  DeleteUser
}