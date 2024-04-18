import Client from "../core/client";

const appointmentsRoute = "/appointments";

async function CreateAppointment({
  patientName,
  phoneNumber,
  startDate,
  endDate,
}) {
  const response = await Client.post({
    path: `${appointmentsRoute}`,
    payload: {
      patientName: patientName,
      phoneNumber: phoneNumber,
      startDate: startDate,
      endDate: endDate,
    },
  });
  return response.data;
}

async function GetAppointment({ id }) {
  const response = await Client.get({
    path: `${appointmentsRoute}/${id}`,
  });
  return response.data;
}

async function GetAppointments({ startDate, endDate }) {
  const startDateISO = startDate.toISOString();
  const endDateISO = endDate.toISOString();
  const response = await Client.get({
    path: `${appointmentsRoute}?startDate=${startDateISO}&endDate=${endDateISO}`,
  });
  return response.data;
}

async function UpdateAppointment({
  id,
  patientName,
  phonenumber,
  startDate,
  endDate,
  isScheduled,
  appointmentCompleted
}) {
  const response = await Client.patch({
    path: `${appointmentsRoute}/${id}`,
    payload: {
      patientName: patientName,
      phonenumber: phonenumber,
      startDate: startDate,
      endDate: endDate,
      isScheduled:isScheduled,
      appointmentCompleted:appointmentCompleted
    },
  });
  return response.data;
}

async function DeleteAppointment({ id }) {
  const response = await Client.delete({
    path: `${appointmentsRoute}/${id}`,
  });
  return response.data;
}

export {
  CreateAppointment,
  GetAppointment,
  GetAppointments,
  UpdateAppointment,
  DeleteAppointment,
};
