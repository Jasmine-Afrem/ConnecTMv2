/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { UserTable } from '@/app/adminpage/usertable'; // Import UserTable component
import { ToggleButton } from '@/app/adminpage/togglebutton';

interface AdminDashboardProps {
  // Add any props if needed
}

export const AdminDashboard: React.FC<AdminDashboardProps> = () => {
  const [showUsersTable, setShowUsersTable] = useState(true);
  const [freelancerApplicants, setFreelancerApplicants] = useState<any[]>([]); // State for freelancer applicants
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [selectedApplicant, setSelectedApplicant] = useState<any | null>(null); // State to store selected applicant for viewing details
  const [description, setDescription] = useState<string>(''); // State to store description input
  const [action, setAction] = useState<'accept' | 'decline' | null>(null); // Action state to know if it's accept or decline

  // Mock data for freelancers (replace with actual fetch or API call)
  useEffect(() => {
    setLoading(false);
    setFreelancerApplicants([
      { id: '1', name: 'Freelancer 1', email: 'freelancer1@example.com', profilePicture: 'https://via.placeholder.com/50', active: true, isAdmin: false, funds: 100 },
      { id: '2', name: 'Freelancer 2', email: 'freelancer2@example.com', profilePicture: 'https://via.placeholder.com/50', active: false, isAdmin: true, funds: 200 },
      { id: '3', name: 'Freelancer 3', email: 'freelancer3@example.com', profilePicture: 'https://via.placeholder.com/50', active: true, isAdmin: false, funds: 150 },
      { id: '4', name: 'Freelancer 4', email: 'freelancer4@example.com', profilePicture: 'https://via.placeholder.com/50', active: true, isAdmin: true, funds: 50 },
      // Add more mocked freelancer data here
    ]);
  }, []);

  const handleAcceptDecline = (applicant: any, action: 'accept' | 'decline') => {
    setSelectedApplicant(applicant);
    setAction(action); // Set the action as either accept or decline
    setDescription(''); // Reset description input field
    setShowModal(true); // Show the modal
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value); // Update description state
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedApplicant(null); // Clear selected applicant
    setAction(null); // Clear action
  };

  const handleSendMessage = () => {
    // Here you can handle sending the message (e.g., save it, show a confirmation, etc.)
    console.log(`Action: ${action} - Message sent to ${selectedApplicant?.name}: ${description}`);
    setShowModal(false); // Close the modal after sending the message
  };

  return (
    <DashboardWrapper>
      <DashboardContainer>
        <header>
          <DashboardHeader>
            <h1>Admin Dashboard</h1>
            <ToggleButton
              onClick={() => setShowUsersTable(!showUsersTable)}
              isOpen={showUsersTable}
              label="Toggle Users Table"
            />
          </DashboardHeader>
        </header>
        <main>
          {showUsersTable && (
            <TableContainer>
              <UserTable />
            </TableContainer>
          )}

          {/* Freelancer Applicants Table */}
          <TableContainer>
            <h2>Freelancer Applicants</h2>
            {loading ? (
              <p>Loading freelancers...</p>
            ) : (
              <FreelancerTable>
                <thead>
                  <tr>
                    <th>Select</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Profile Picture</th>
                    <th>Accept/Decline</th>
                  </tr>
                </thead>
                <tbody>
                  {freelancerApplicants.length === 0 ? (
                    <tr>
                      <td colSpan={5}>No applicants found.</td>
                    </tr>
                  ) : (
                    freelancerApplicants.map((applicant) => (
                      <TableRow key={applicant.id}>
                        <td>
                          <input type="checkbox" aria-label={`Select ${applicant.name}`} />
                        </td>
                        <td>{applicant.name}</td>
                        <td>{applicant.email}</td>
                        <td>
                          <ProfilePicture src={applicant.profilePicture} alt={applicant.name} />
                        </td>
                        <td>
                          <AcceptButton onClick={() => handleAcceptDecline(applicant, 'accept')}>Accept</AcceptButton>
                          <DeclineButton onClick={() => handleAcceptDecline(applicant, 'decline')}>Decline</DeclineButton>
                        </td>
                      </TableRow>
                    ))
                  )}
                </tbody>
              </FreelancerTable>
            )}
          </TableContainer>
        </main>
      </DashboardContainer>

      {/* Modal for Writing Message to Applicant */}
      {showModal && selectedApplicant && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <h3>{selectedApplicant.name}</h3>
              <CloseButton onClick={handleCloseModal}>X</CloseButton>
            </ModalHeader>
            <ModalBody>
              <p><strong>Action:</strong> {action === 'accept' ? 'Accepting' : 'Declining'} the applicant</p>
              <p><strong>Message:</strong></p>
              <DescriptionInput
                type="text"
                value={description}
                onChange={handleDescriptionChange}
                placeholder="Enter your message here"
              />
            </ModalBody>
            <ModalActions>
              <ActionButton onClick={handleSendMessage}>Send Message</ActionButton>
              <ActionButton onClick={handleCloseModal}>Close</ActionButton>
            </ModalActions>
          </ModalContent>
        </Modal>
      )}
    </DashboardWrapper>
  );
};

// Styled Components
const DashboardWrapper = styled.div`
  background-image: url('https://www.shutterstock.com/image-vector/business-job-icon-doodle-seamless-600nw-2285217401.jpg');
  min-height: 100vh;
  padding: 40px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  backdrop-filter: blur(8px);
  z-index: 998;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  overflow: auto;

  @media (max-width: 640px) {
    padding: 30px;
    min-height: 100vh;
    height: auto;
  }
`;

const DashboardContainer = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 30px;
  background-color: #1e293b;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: white;
`;

const DashboardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;

  h1 {
    font-size: 24px;
    margin: 0;
  }
`;

const TableContainer = styled.div`
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 20px;
`;

const FreelancerTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;

  th, td {
    text-align: left;
    padding: 12px 15px;
  }

  th {
    background-color: #1e293b;
    color: white;
    font-weight: 600;
  }

  td {
    background-color: #2d3748;
    color: white;
  }

  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-left: 23px;
  }
`;

const TableRow = styled.tr`
  background-color: transparent;
  &:nth-child(even) {
    background-color: #333c49;
  }
`;

const ProfilePicture = styled.img`
  border-radius: 50%;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: space-between;  /* Distribute space evenly between buttons */
  gap: 20px;  /* Add some space between the buttons */
  margin-top: 20px;
`;

const AcceptButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  border: none;
`;

const DeclineButton = styled.button`
  background-color: #ad0000;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  border: none;
`;


const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  color: black;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const CloseButton = styled.button`
  background-color: #ad0000;
  color: white;
  border: none;
  padding-top: 4px;
  padding-bottom: 4px;
  padding-left: 8px;
  padding-right: 8px;
  border-radius: 32px;
  cursor: pointer;
`;

const ModalBody = styled.div`
  p {
    margin: 10px 0;
  }
`;

const DescriptionInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  font-size: 14px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const ActionButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  border: none;
  &:hover {
    background-color: #45a049;
  }
`;

export default AdminDashboard;
