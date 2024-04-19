import { Layout, Table, Tag, notification, Button } from "antd";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { GetUsers } from "../../repository/user";
import UserModal from "./UserModal";
import { PoweroffOutlined } from "@ant-design/icons";
import Cookies from "universal-cookie";
const { Content } = Layout;

export default function UsersPanel() {
  const [api, contextHolder] = notification.useNotification();
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [shouldFetchUsers, setShouldFetchUsers] = useState(true);
  const [showUserModal, setShowUserModal] = useState({
    visible: false,
    user: null,
  });

  const showErrorNotification = useCallback(
    (message) => {
      api.error({
        message: "Error",
        description: message,
      });
    },
    [api]
  );

  const fetchUsers = useCallback(async () => {
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
        setShouldFetchUsers(false);
      });
  }, [showErrorNotification]);

  const handleLogout = async () => {
    const cookies = new Cookies();
    cookies.remove("token");
    cookies.remove("refreshToken");
    cookies.remove("username");
    window.location.reload();
  };

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      render: (text) => <h3>{text}</h3>,
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
    {
      title: "Actions",
      key: "action",
      render: (text, record) => (
        <div>
          <Button
            onClick={() => {
              setShowUserModal({
                visible: true,
                user: record,
              });
            }}
          >
            Edit
          </Button>
        </div>
      ),
      align: "right",
    },
  ];

  useEffect(() => {
    if (shouldFetchUsers) fetchUsers();
  }, [shouldFetchUsers]);

  return (
    <Layout>
      <Content>
        {contextHolder}
        <UserModal
          showModal={showUserModal}
          setShowModal={setShowUserModal}
          setShouldFetchUsers={setShouldFetchUsers}
        />
        <CreateUserDiv>
          <Button
            icon={<PoweroffOutlined />}
            type="default"
            style={{ marginRight: 10, color: "#c90000" }}
            onClick={handleLogout}
          >
            Logout
          </Button>
          <Button
            type="primary"
            onClick={() =>
              setShowUserModal({
                visible: true,
                user: null,
              })
            }
          >
            Create User
          </Button>
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
