import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import { GetAppointments, UpdateAppointment } from "../repository/appointment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { isMobile } from "react-device-detect";

const DnDCalendar = withDragAndDrop(Calendar);

const localizer = momentLocalizer(moment);

export default function AppointmentsCalander({
  shouldFetchAppointments,
  setShouldFetchAppointments,
  setShowAppointmentModal,
}) {
  var currentDate = useMemo(() => new Date(), []);
  const dateRange = useMemo(() => {
    const startOfLastMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    const endOfNextMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 2,
      0
    );

    return {
      start: startOfLastMonth,
      end: endOfNextMonth,
    };
  }, [currentDate]);

  const [calenderDateRange, setCalenderDateRange] = useState(dateRange);
  const [myEvents, setEvents] = useState([]);

  const fetchAppointments = useCallback(
    async (startDate, endDate, append) => {
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
          if (append) {
            setEvents((prevAppointments) => {
              const existingIds = new Set(
                prevAppointments.map((app) => app.id)
              );

              const uniqueAppointments = mappedEvents.filter(
                (app) => !existingIds.has(app.id)
              );
              console.log(uniqueAppointments);

              return [...prevAppointments, ...uniqueAppointments];
            });
          } else {
            setEvents(mappedEvents);
          }
        }
        setShouldFetchAppointments(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    [setShouldFetchAppointments]
  );

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
    [setShowAppointmentModal]
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

  const handleNavigate = async (date) => {
    let startOfTheWeekView = new Date(date);
    startOfTheWeekView.setDate(startOfTheWeekView.getDate() - 7);

    if (startOfTheWeekView < calenderDateRange.start) {
      console.log("found older date");
      const startOfLastMonth = new Date(date);
      startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);
      startOfLastMonth.setDate(1);

      await fetchAppointments(startOfLastMonth, dateRange.start, true);

      setCalenderDateRange({
        start: startOfLastMonth,
        end: calenderDateRange.end,
      });
    } else if (date > calenderDateRange.end) {
      console.log("found newer date");
      const endOfNextMonth = new Date(date);
      endOfNextMonth.setMonth(endOfNextMonth.getMonth() + 2);
      endOfNextMonth.setDate(0);

      await fetchAppointments(calenderDateRange.end, endOfNextMonth, true);

      setCalenderDateRange({
        start: calenderDateRange.start,
        end: endOfNextMonth,
      });
    }
  };

  const moveEvent = useCallback(
    ({ event, start, end }) => {
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
    [setEvents, setShouldFetchAppointments]
  );

  const slotPropGetter = (date) => {
    // Friday is excluded
    if (date.getDay() === 5)
      return {
        className: "excluded-date",
      };
  };

  const eventStyleGetter = (event) => {
    const style = {
      backgroundColor: "#808080",
      borderRadius: "5px",
      color: "white",
      border: "none",
      boxShadow: "2px 2px 2px #888888",
    };
    if (event.appointmentCompleted) {
      style.backgroundColor = "#4caf50";
    } else if (event.isScheduled) {
      style.backgroundColor = "#3174ad";
    }
    return {
      style,
    };
  };

  useEffect(() => {
    if (shouldFetchAppointments)
      fetchAppointments(calenderDateRange.start, calenderDateRange.end);
  }, [shouldFetchAppointments, fetchAppointments, calenderDateRange]);

  console.log(myEvents);

  return (
    <DnDCalendar
      defaultView={isMobile ? Views.DAY : Views.WEEK}
      events={myEvents}
      localizer={localizer}
      onSelectEvent={handleSelectEvent}
      onSelectSlot={handleSelectSlot}
      onNavigate={handleNavigate}
      onEventDrop={moveEvent}
      resizable={false}
      slotPropGetter={slotPropGetter}
      eventPropGetter={eventStyleGetter}
      views={{
        month: false,
        week: true,
        day: true,
        agenda: true,
      }}
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
  );
}
