import { useState } from "react";
import styled from "styled-components";

export function Clock() {
  let time = new Date().toLocaleTimeString([], { hour12: true });
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayOfWeek = weekdays[new Date().getDay()];

  const [ctime, setTime] = useState(time);
  const UpdateTime = () => {
    time = new Date().toLocaleTimeString([], { hour12: true });
    setTime(time);
  };
  setInterval(UpdateTime);
  return (
    <ClockDiv>
      {dayOfWeek} {ctime}
    </ClockDiv>
  );
}

const ClockDiv = styled.h2`
  display: flex;
  margin-left: 5px;
  margin-top: 10px;

  @media (max-width: 768px) {
    /* Define styles for smaller screens here */
    flex-direction: column;
    align-items: center;
    margin-bottom:20px;
  }
`;
