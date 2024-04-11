import { Layout, Button } from "antd";
import AppointmentsCalander from "./Calandar";
import AppointmentModal from "./AppointmentModal";
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
        <PanelHeaderDiv>
          <EventTypesDiv>
            <EventTypeDiv>
              <EventTypeIcon />
              <EventLabel>Default</EventLabel>
            </EventTypeDiv>
            <EventTypeDiv>
              <EventTypeIcon style={{ backgroundColor: "#f57c00" }} />
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
        <AppointmentsCalander
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
  flex-wrap:wrap;
  @media (max-width: 768px) {
    /* Define styles for smaller screens here */
    flex-direction: column;
    align-items: center;
    margin-top:10px;
    margin-bottom:10px;
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
`;

const EventTypeDiv = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
`;
const EventTypeIcon = styled.div`
  width: 20px;
  height: 20px;
  background-color: #3174ad;

  border-radius: 5px;
`;

const EventLabel = styled.div`
  margin-left: 10px;
`;
