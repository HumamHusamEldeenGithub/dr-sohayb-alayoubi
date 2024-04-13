import { Modal, Input, notification, Button, Select } from "antd";
import { useEffect, useState } from "react";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { RegisterUser } from "../repository/auth";
import { DeleteUser, UpdateUser } from "../repository/user";

export default function UserModal({
  showModal,
  setShowModal,
  setShouldFetchUsers,
}) {
  const [api, contextHolder] = notification.useNotification();
  const [confirmCreateLoading, setConfirmCreateLoading] = useState(false);
  const [confirmUpdateLoading, setConfirmUpdateLoading] = useState(false);
  const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);
  const [userID, setUserID] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [updateUserMode, setUpdateUserMode] = useState(false);

  const rolesList = [
    {
      value: "admin",
      label: "Admin",
    },
    {
      value: "moderator",
      label: "Moderator",
    },
  ];

  const handleCreate = () => {
    setConfirmCreateLoading(true);
    RegisterUser({
      username: username.trim(),
      password: password,
      role: role,
    })
      .then(() => {
        setShouldFetchUsers(true);
        setShowModal(false);
        showSuccessNotification("User has been created successfully");
      })
      .catch((err) => {
        var errorBody = "";
        if (err.response && err.response.data) errorBody = err.response.data;
        else errorBody = { message: "an error has occured, please try again" };
        showErrorNotification(errorBody.message);
        console.error(err);
      })
      .finally(() => setConfirmCreateLoading(false));
  };

  const handleUpdate = () => {
    setConfirmUpdateLoading(true);
    UpdateUser({
      id: userID,
      password: password,
    })
      .then(() => {
        setShouldFetchUsers(true);
        setShowModal(false);
        showSuccessNotification("User has been updated successfully");
      })
      .catch((err) => {
        var errorBody = "";
        if (err.response && err.response.data) errorBody = err.response.data;
        else errorBody = { message: "an error has occured, please try again" };
        showErrorNotification(errorBody.message);
        console.error(err);
      })
      .finally(() => setConfirmUpdateLoading(false));
  };

  const handleDelete = () => {
    setConfirmDeleteLoading(true);
    DeleteUser({
      id: userID,
    })
      .then(() => {
        setShouldFetchUsers(true);
        setShowModal(false);
        showSuccessNotification("User has been deleted successfully");
      })
      .catch((err) => {
        var errorBody = "";
        if (err.response && err.response.data) errorBody = err.response.data;
        else errorBody = { message: "an error has occured, please try again" };
        showErrorNotification(errorBody.message);
        console.error(err);
      })
      .finally(() => setConfirmDeleteLoading(false));
  };

  const handleCancel = () => {
    setShowModal(false);
  };

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

  function clearModal() {
    setUserID("");
    setUsername("");
    setPassword("");
    setUpdateUserMode(false);
  }

  useEffect(() => {
    if (showModal.visible) {
      if (showModal.user) {
        const user = showModal.user;
        setUserID(user._id ?? "");
        setUsername(user.username ?? "");
        setPassword("");
        setRole(user.role ?? "");
        setUpdateUserMode(true);
      } else {
        clearModal();
      }
    }
  }, [showModal]);

  return (
    <Modal
      title={`${userID !== "" ? "Update" : "Create"} User`}
      open={showModal.visible}
      onCancel={handleCancel}
      footer={
        userID !== ""
          ? [
              <Button key="1" onClick={handleCancel}>
                Cancel
              </Button>,
              <Button
                key="2"
                onClick={handleDelete}
                loading={confirmDeleteLoading}
                danger
              >
                Delete
              </Button>,
              <Button
                key="3"
                onClick={handleUpdate}
                type="primary"
                loading={confirmUpdateLoading}
              >
                Update
              </Button>,
            ]
          : [
              <Button key="1" onClick={handleCancel}>
                Cancel
              </Button>,
              <Button
                key="2"
                onClick={handleCreate}
                type="primary"
                loading={confirmCreateLoading}
              >
                Create
              </Button>,
            ]
      }
    >
      {contextHolder}
      <InputDiv>
        <label htmlFor="usernameInput">Username :</label>
        <Input
          id="usernameInput"
          prefix={<UserOutlined />}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={updateUserMode}
        />
      </InputDiv>
      <InputDiv>
        <label htmlFor="passwordInput">Password :</label>
        <Input
          id="passwordInput"
          prefix={<LockOutlined />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </InputDiv>
      <InputDiv>
        <label htmlFor="roleSelect">Role :</label>
        <Select
          id="roleSelect"
          value={role}
          onChange={(value) => {
            setRole(value);
          }}
          options={rolesList}
          style={{ width: "100%" }}
          disabled={updateUserMode}
        ></Select>
      </InputDiv>
    </Modal>
  );
}

const InputDiv = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
`;
