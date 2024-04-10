import {
  Modal,
  DatePicker,
  Input,
  TimePicker,
  Flex,
  notification,
  Button,
  Checkbox,
} from "antd";
import { useEffect, useState } from "react";
import { UserOutlined, PhoneOutlined } from "@ant-design/icons";
import styled from "styled-components";
import {
  CreateAppointment,
  DeleteAppointment,
  UpdateAppointment,
} from "../repository/appointment";
import moment from "moment";
import dayjs from "dayjs";


export default function AppointmentModal({
  showModal,
  setShowModal,
  setShouldFetchAppointments,
}) {
  var currentDate = new Date();

  const [api, contextHolder] = notification.useNotification();
  const [confirmCreateLoading, setConfirmCreateLoading] = useState(false);
  const [confirmUpdateLoading, setConfirmUpdateLoading] = useState(false);
  const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);
  const [appointmentId, setAppointmentId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedDate, setSelectedDate] = useState({
    date: null,
    dateString: "",
  });
  const [fromTime, setFromTime] = useState({
    date: null,
    dateString: "",
  });
  const [toTime, setToTime] = useState({
    date: null,
    dateString: "",
  });
  const [isScheduled, setIsScheduled] = useState(false);
  const [patientAttended, setPatientAttended] = useState(false);

  const formatDate = (date, time) => {
    const dateTimeString = `${date}T${time}:00.000`;
    return moment(dateTimeString, "YYYY-MM-DDTHH:mm:ss.SSS");
  };

  const handleCreate = () => {
    setConfirmCreateLoading(true);

    CreateAppointment({
      patientName: patientName,
      phoneNumber: phoneNumber,
      startDate: formatDate(selectedDate.dateString, fromTime.dateString),
      endDate: formatDate(selectedDate.dateString, toTime.dateString),
    })
      .then(() => {
        setShouldFetchAppointments(true);
        setShowModal(false);
        showSuccessNotification("Appointment has been created successfully");
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

    UpdateAppointment({
      id: appointmentId,
      patientName: patientName,
      phoneNumber: phoneNumber,
      startDate: formatDate(selectedDate.dateString, fromTime.dateString),
      endDate: formatDate(selectedDate.dateString, toTime.dateString),
      isScheduled: isScheduled,
      appointmentCompleted: patientAttended,
    })
      .then(() => {
        setShouldFetchAppointments(true);
        setShowModal(false);
        showSuccessNotification("Appointment has been updated successfully");
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
    DeleteAppointment({
      id: appointmentId,
    })
      .then(() => {
        setShouldFetchAppointments(true);
        setShowModal(false);
        showSuccessNotification("Appointment has been deleted successfully");
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
    setAppointmentId("");
    setPatientName("");
    setPhoneNumber("");
    setSelectedDate({
      date: null,
      dateString: "",
    });
    setFromTime({
      date: null,
      dateString: "",
    });
    setToTime({
      date: null,
      dateString: "",
    });
    setIsScheduled(false);
    setPatientAttended(false);
  }

  useEffect(() => {
    if (showModal.visible) {
      if (showModal.appointment) {
        const appointment = showModal.appointment;

        setAppointmentId(appointment.id ?? "");
        setPatientName(appointment.title ?? "");
        setPhoneNumber(appointment.phoneNumber ?? "");

        const startDate = dayjs(appointment.start);
        const endDate = dayjs(appointment.end);

        setSelectedDate({
          date: startDate,
          dateString: startDate.format("YYYY-MM-DD"),
        });

        setFromTime({
          date: startDate,
          dateString: startDate.format("HH:mm"),
        });

        setToTime({
          date: endDate,
          dateString: endDate.format("HH:mm"),
        });

        setIsScheduled(appointment.isScheduled ?? false);
        setPatientAttended(appointment.appointmentCompleted ?? false);
      } else {
        clearModal();
      }
    }
  }, [showModal]);

  const minTime = dayjs(new Date()).set("hour", 11);
  console.log(minTime);

  const maxTime = dayjs(new Date()).set("hour", 20);

  return (
    <Modal
      title={`${appointmentId !== "" ? "Update" : "Create"} Appointment`}
      open={showModal.visible}
      onCancel={handleCancel}
      footer={
        appointmentId !== ""
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
        <label htmlFor="patientNameInput">Patient Name:</label>
        <Input
          id="patientNameInput"
          prefix={<UserOutlined />}
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
        />
      </InputDiv>
      <InputDiv>
        <label htmlFor="phoneNumberInput">Phone Number:</label>
        <Input
          type="number"
          id="phoneNumberInput"
          prefix={<PhoneOutlined />}
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </InputDiv>

      <InputDiv>
        <label htmlFor="dateRangePicker">Date:</label>
        <DatePicker
          id="dateRangePicker"
          format="YYYY-MM-DD"
          value={selectedDate.date}
          onChange={(dateRaw, dateStr) => {
            setSelectedDate({
              date: dateRaw,
              dateString: dateStr,
            });
          }}
          style={{ width: "100%" }}
        />
      </InputDiv>
      <Flex justify="space-between">
        <InputDiv>
          <label htmlFor="toDatePicker">From Time :</label>{" "}
          <TimePicker
            showNow={false}
            minuteStep={30}
            format="HH:mm"
            value={fromTime.date}
            onChange={(timeRaw, timeStr) => {
              setFromTime({
                date: timeRaw,
                dateString: timeStr,
              });
            }}
            needConfirm={false}
            //dis
          />
        </InputDiv>
        <InputDiv>
          <label htmlFor="toDatePicker">To Time : </label>
          <TimePicker
            id="toDatePicker"
            minDate={minTime}
            maxDateDate={maxTime}
            showNow={false}
            minuteStep={30}
            format="HH:mm"
            value={toTime.date}
            onChange={(timeRaw, timeStr) => {
              setToTime({
                date: timeRaw,
                dateString: timeStr,
              });
            }}
            needConfirm={false}
          />
        </InputDiv>
      </Flex>
      <InputDiv>
        <Checkbox
          checked={isScheduled}
          onChange={(e) => setIsScheduled(e.target.checked)}
        >
          Is Scheduled
        </Checkbox>
      </InputDiv>
      <InputDiv>
        <Checkbox
          checked={patientAttended}
          onChange={(e) => setPatientAttended(e.target.checked)}
        >
          Patient attented
        </Checkbox>
      </InputDiv>
    </Modal>
  );
}

const InputDiv = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
`;
