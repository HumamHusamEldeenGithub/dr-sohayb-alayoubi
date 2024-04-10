import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import { GetAppointments, UpdateAppointment } from "../repository/appointment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

const DnDCalendar = withDragAndDrop(Calendar);

const localizer = momentLocalizer(moment);

export default function AppointmentsCalander({
  shouldFetchAppointments,
  setShouldFetchAppointments,
  setShowAppointmentModal,
}) {
  var currentDate = new Date();

  var lastMonth = new Date(currentDate);
  lastMonth.setDate(lastMonth.getDate() - 30);

  var nextYear = new Date(currentDate);
  nextYear.setDate(nextYear.getDate() + 365);

  const [myEvents, setEvents] = useState([]);

  const fetchAppointments = async (startDate, endDate) => {
    try {
      const appointments = await GetAppointments({
        startDate: startDate,
        endDate: endDate,
      });
      if (appointments !== null) {
        const mappedEvents = appointments.map((appointment) => ({
          id: appointment._id,
          title: appointment.patientName,
          start: moment(appointment.startDate).toDate(),
          end: moment(appointment.endDate).toDate(),
          phoneNumber: appointment.phoneNumber,
          isScheduled: appointment.isScheduled,
          appointmentCompleted: appointment.appointmentCompleted,
        }));
        setEvents(mappedEvents);
      }
      setShouldFetchAppointments(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (shouldFetchAppointments) fetchAppointments(lastMonth, nextYear);
  }, [shouldFetchAppointments, fetchAppointments]);

  const handleSelectSlot = useCallback(
    ({ start, end }) => {
      setShowAppointmentModal({
        visible: true,
        appointment: {
          start,
          end,
        },
      });
    },
    [setEvents]
  );

  const handleSelectEvent = useCallback(
    (event) => {
      setShowAppointmentModal({
        visible: true,
        appointment: event,
      });
    },
    [setShowAppointmentModal]
  );

  const moveEvent = useCallback(
    ({ event, start, end }) => {
      console.log(event);
      console.log(start);
      console.log(end);
      UpdateAppointment({
        id: event.id,
        startDate: moment(start, "YYYY-MM-DDTHH:mm:ss.SSS"),
        endDate: moment(end, "YYYY-MM-DDTHH:mm:ss.SSS"),
      })
        .then(() => {
          setShouldFetchAppointments(true);
        })
        .catch((err) => {
          console.log(err);
        });
      setEvents((prev) => {
        const existing = prev.find((ev) => ev.id === event.id) ?? {};
        const filtered = prev.filter((ev) => ev.id !== event.id);
        return [...filtered, { ...existing, start, end }];
      });
    },
    [setEvents]
  );

  const slotPropGetter = (date) => {
    // Friday is excluded
    if (date.getDay() === 5)
      return {
        className: "excluded-date",
      };
  };

  const eventStyleGetter = (event, start, end, isSelected) => {
    const style = {
      backgroundColor: "#3174ad",
      borderRadius: "5px",
      color: "white",
      border: "none",
      boxShadow: "2px 2px 2px #888888",
    };
    if (event.appointmentCompleted) {
      style.backgroundColor = "#4caf50";
    } else if (event.isScheduled) {
      style.backgroundColor = "#f57c00";
    }

    return {
      style,
    };
  };

  console.log(myEvents);

  return (
    <div className="myCustomHeight">
      <DnDCalendar
        defaultView={Views.WEEK}
        events={myEvents}
        localizer={localizer}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        onEventDrop={moveEvent}
        resizable={false}
        slotPropGetter={slotPropGetter}
        eventPropGetter={eventStyleGetter}
        views={
          {
            month:false,
            week:true,
            day:true,
            agenda:true
          }
        }
        selectable
        popup
        // start time : 11:00 AM
        min={
          new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
            11
          )
        }
        // end time 8:00 PM
        max={
          new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
            20
          )
        }
      />
    </div>
  );
}
