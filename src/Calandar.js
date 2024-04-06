import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import React, { useState, useCallback, useMemo } from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";

// Setup the localizer by providing the moment (or globalize, or Luxon) Object
// to the correct localizer.
const localizer = momentLocalizer(moment); // or globalizeLocalizer

export default function MyCalendar() {
  var currentDate = new Date();
  var nextWeekDate = new Date(currentDate);
  nextWeekDate.setDate(nextWeekDate.getDate() + 5);

  const events = [
    {
      start: moment(`2024-04-06T17:00:00`).toDate(),
      end: moment(`2024-04-06T17:30:00`).toDate(),
      title: "Humam Husam Eldeen",
    },
    {
      start: moment(`2024-04-06T17:30:00`).toDate(),
      end: moment(`2024-04-06T18:00:00`).toDate(),
      title: "همام حسام الدين",
    },
  ];

  const [myEvents, setEvents] = useState(events);

  const handleSelectSlot = useCallback(
    ({ start, end }) => {
      const title = window.prompt("New Event name");
      if (title) {
        setEvents((prev) => [...prev, { start, end, title }]);
      }
    },
    [setEvents]
  );

  const handleSelectEvent = useCallback(
    (event) => window.alert(event.title),
    []
  );

  const { defaultDate, scrollToTime } = useMemo(
    () => ({
      defaultDate: nextWeekDate,
      scrollToTime: new Date(1970, 1, 1, 6),
    }),
    []
  );

  return (
    <div className="myCustomHeight">
      <Calendar
        defaultView={Views.WEEK}
        events={myEvents}
        localizer={localizer}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        selectable
        scrollToTime={scrollToTime}
      />
    </div>
  );
}
