import { Layout, Button } from "antd";
import AppointmentsCalender from "./AppointmentsCalender";
import AppointmentModal from "./AppointmentModal";
import { Clock } from "./Clock";
import { useState } from "react";
import styled from "styled-components";
const { Content } = Layout;

export default function CalendarPanel() {
  const [showAppointmentModal, setShowAppointmentModal] = useState({
    visible: false,
    appointment: null,
  });
  const [shouldFetchAppointments, setShouldFetchAppointments] = useState(true);
  return (
    <Layout>
      <Content>
        <Clock />
        <PanelHeaderDiv>
          <EventTypesDiv>
            <EventTypeDiv>
              <EventTypeIcon />
              <EventLabel>Default</EventLabel>
            </EventTypeDiv>
            <EventTypeDiv>
              <EventTypeIcon style={{ backgroundColor: "#3174ad" }} />
              <EventLabel>Scheduled</EventLabel>
            </EventTypeDiv>
            <EventTypeDiv>
              <EventTypeIcon style={{ backgroundColor: "#4caf50" }} />
              <EventLabel>Completed</EventLabel>
            </EventTypeDiv>
          </EventTypesDiv>

          <CreateAppointmetnDiv>
            <Button
              onClick={() => {
                setShowAppointmentModal({
                  visible: true,
                  appointment: null,
                });
              }}
              type="primary"
            >
              Create Appointment
            </Button>
          </CreateAppointmetnDiv>
        </PanelHeaderDiv>

        <AppointmentModal
          showModal={showAppointmentModal}
          setShowModal={setShowAppointmentModal}
          setShouldFetchAppointments={setShouldFetchAppointments}
        />
        <AppointmentsCalender
          shouldFetchAppointments={shouldFetchAppointments}
          setShouldFetchAppointments={setShouldFetchAppointments}
          setShowAppointmentModal={setShowAppointmentModal}
        />
      </Content>
    </Layout>
  );
}

const PanelHeaderDiv = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  @media (max-width: 768px) {
    /* Define styles for smaller screens here */
    flex-direction: column;
    align-items: center;
    margin-top: 10px;
    margin-bottom: 10px;
  }
`;

const EventTypesDiv = styled.div`
  display: flex;
`;

const CreateAppointmetnDiv = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  margin: 10px;
  margin-right: 0;
`;

const EventTypeDiv = styled.div`
  display: flex;
  align-items: center;
  margin-left: 5px;
  margin-right: 5px;
`;
const EventTypeIcon = styled.div`
  width: 20px;
  height: 20px;
  background-color: #808080;

  border-radius: 5px;
`;

const EventLabel = styled.div`
  margin-left: 10px;
`;
