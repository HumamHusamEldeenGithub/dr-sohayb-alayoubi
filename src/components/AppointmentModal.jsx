import {
  Modal,
  DatePicker,
  Input,
  Flex,
  notification,
  Button,
  Checkbox,
  Select,
} from "antd";
import { useEffect, useMemo, useState, useCallback } from "react";
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
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [isScheduled, setIsScheduled] = useState(false);
  const [patientAttended, setPatientAttended] = useState(false);

  const timePickerOptions = useMemo(() => {
    const options = [];
    for (let hour = 11; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const hour12 = hour > 12 ? hour - 12 : hour;
        const ampm = hour >= 12 ? "PM" : "AM";
        const timeStringValue = `${hour12.toString()}:${minute
          .toString()
          .padStart(2, "0")}`;
        const timeStringKey = `${timeStringValue} ${ampm}`;
        options.push({
          value: timeStringKey,
          label: timeStringKey,
        });
      }
    }
    return options;
  }, []);

  function convertTo24Hour(time12h) {
    try {
      const [time, period] = time12h.split(" ");
      const [hour, minute] = time.split(":");

      let hour24;
      if (period.toLowerCase() === "pm") {
        hour24 = parseInt(hour, 10) + 12;
        if (hour24 === 24) {
          hour24 = 12;
        }
      } else {
        hour24 = parseInt(hour, 10);
        if (hour24 === 12) {
          hour24 = 0;
        }
      }

      return `${hour24.toString().padStart(2, "0")}:${minute}`;
    } catch (error) {
      console.error(error);
    }
  }

  const formatDate = (date, time) => {
    const dateTimeString = `${date}T${convertTo24Hour(time)}:00.000`;
    console.log(dateTimeString);
    return moment(dateTimeString, "YYYY-MM-DDTHH:mm:ss.SSS");
  };

  const handleCreate = () => {
    setConfirmCreateLoading(true);

    CreateAppointment({
      patientName: patientName,
      phoneNumber: phoneNumber,
      startDate: formatDate(selectedDate.dateString, fromTime),
      endDate: formatDate(selectedDate.dateString, toTime),
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
      startDate: formatDate(selectedDate.dateString, fromTime),
      endDate: formatDate(selectedDate.dateString, toTime),
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

  const showErrorNotification = useCallback(
    (message) => {
      api.error({
        message: "Error",
        description: message,
      });
    },
    [api]
  );

  const showSuccessNotification = useCallback(
    (message) => {
      api.success({
        message: "Succeeded",
        description: message,
      });
    },
    [api]
  );

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

        const startHour = startDate.format("h:mm A");
        const endHour = endDate.format("h:mm A");

        setFromTime(startHour);
        setToTime(endHour);

        setIsScheduled(appointment.isScheduled ?? false);
        setPatientAttended(appointment.appointmentCompleted ?? false);
      } else {
        clearModal();
      }
    }
  }, [showModal]);

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
          <Select
            defaultValue="11:00"
            style={{ width: 120 }}
            value={fromTime}
            onChange={(value) => {
              setFromTime(value);
            }}
            options={timePickerOptions}
          ></Select>
        </InputDiv>
        <InputDiv>
          <label htmlFor="toDatePicker">To Time : </label>
          <Select
            defaultValue="11:00"
            style={{ width: 120 }}
            value={toTime}
            onChange={(value) => {
              setToTime(value);
            }}
            options={timePickerOptions}
          ></Select>
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
