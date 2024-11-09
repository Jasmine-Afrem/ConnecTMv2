/* eslint-disable @typescript-eslint/no-empty-object-type */
'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { UserTable } from '@/app/adminpage/usertable';
import { TicketTable } from '@/app/adminpage/tickettable';
import { ToggleButton } from '@/app/adminpage/togglebutton';

interface AdminDashboardProps {
  // Add any props if needed
}

export const AdminDashboard: React.FC<AdminDashboardProps> = () => {
  const [showUsersTable, setShowUsersTable] = useState(true);
  const [showTicketsTable, setShowTicketsTable] = useState(true);

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
          {showUsersTable && <UserTable />}
          <section>
            <TicketHeader>
              <h2>Support Tickets</h2>
              <ToggleButton
                onClick={() => setShowTicketsTable(!showTicketsTable)}
                isOpen={showTicketsTable}
                label="Toggle Tickets Table"
              />
            </TicketHeader>
            {showTicketsTable && <TicketTable />}
          </section>
        </main>
      </DashboardContainer>
    </DashboardWrapper>
  );
};

const DashboardWrapper = styled.div`
  background-color: #424a59;
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

const TicketHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;

  h2 {
    font-size: 20px;
    margin: 0;
  }
`;

export default AdminDashboard;