import { Layout, Table, Tag, notification, Button } from "antd";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { GetUsers } from "../repository/user";
const { Content } = Layout;

export default function UsersPanel() {
  const [api, contextHolder] = notification.useNotification();
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  function showErrorNotification(message) {
    api.error({
      message: "Error",
      description: message,
    });
  }

  function showSuccessNotification(message) {
    api.success({
      message: "Succeeded",
      description: message,
    });
  }

  const fetchUsers = async () => {
    setLoadingUsers(true);
    GetUsers()
      .then((users) => {
        setUsers(users);
      })
      .catch((err) => {
        var errorBody = "";
        if (err.response && err.response.data) errorBody = err.response.data;
        else errorBody = { message: "an error has occured, please try again" };

        showErrorNotification(errorBody.message);
        console.error(err);
      })
      .finally(() => {
        setLoadingUsers(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (text) => (
        <Tag color={text === "admin" ? "green" : "geekblue"} key="1">
          {text?.toUpperCase()}
        </Tag>
      ),
    },
  ];
  return (
    <Layout>
      <Content>
        {contextHolder}
        <CreateUserDiv>
          <Button type="primary">Create User</Button>
        </CreateUserDiv>
        <Table
          columns={columns}
          rowKey={(record) => record._id}
          dataSource={users}
          loading={loadingUsers}
          pagination={false}
        />
      </Content>
    </Layout>
  );
}

const CreateUserDiv = styled.div`
  display: flex;
  justify-content: end;
  padding: 5px;
`;
