/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

interface Ticket {
  id: string;
  subject: string;
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'closed';
}

export const TicketTable: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null); // state for selected ticket
  const [isModalOpen, setIsModalOpen] = useState(false); // state for modal visibility

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/admin/tickets');
        if (!response.ok) {
          throw new Error('Failed to fetch tickets');
        }
        const data = await response.json();
        setTickets(data.tickets || []); // Fallback to an empty array if 'tickets' is undefined
      } catch (error) {
        setError('Failed to load tickets');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const toggleTicketSelection = (ticketId: string) => {
    setSelectedTickets(prev =>
      prev.includes(ticketId) ? prev.filter(id => id !== ticketId) : [...prev, ticketId]
    );
  };

  const openTicketDetails = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true); // open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // close the modal
    setSelectedTicket(null); // reset selected ticket
  };

  return (
    <TableWrapper>
      {error && <ErrorText>{error}</ErrorText>}
      <Table>
        <thead>
          <tr>
            <th>Select</th>
            <th>Ticket ID</th>
            <th>Subject</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6}>Loading tickets...</td>
            </tr>
          ) : (
            tickets.length > 0 ? (
              tickets.map(ticket => (
                <TableRow key={ticket.id} selected={selectedTickets.includes(ticket.id)}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedTickets.includes(ticket.id)}
                      onChange={() => toggleTicketSelection(ticket.id)}
                      aria-label={`Select ticket ${ticket.id}`}
                    />
                  </td>
                  <td>{ticket.id}</td>
                  <td>{ticket.subject}</td>
                  <td>
                    <PriorityBadge priority={ticket.priority}>
                      {ticket.priority}
                    </PriorityBadge>
                  </td>
                  <td>
                    <StatusBadge status={ticket.status}>
                      {ticket.status}
                    </StatusBadge>
                  </td>
                  <td>
                    <ActionButton onClick={() => openTicketDetails(ticket)}>
                      View Ticket
                    </ActionButton>
                  </td>
                </TableRow>
              ))
            ) : (
              <tr>
                <td colSpan={6}>No tickets available.</td>
              </tr>
            )
          )}
        </tbody>
      </Table>

      {/* Modal for Ticket Details */}
      {isModalOpen && selectedTicket && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <h3>Ticket Details</h3>
              <CloseButton onClick={closeModal}>X</CloseButton>
            </ModalHeader>
            <ModalBody>
              <p><strong>Ticket ID:</strong> {selectedTicket.id}</p>
              <p><strong>Subject:</strong> {selectedTicket.subject}</p>
              <p><strong>Priority:</strong> {selectedTicket.priority}</p>
              <p><strong>Status:</strong> {selectedTicket.status}</p>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </TableWrapper>
  );
};

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const ErrorText = styled.p`
  color: red;
  font-size: 14px;
  margin-bottom: 10px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableRow = styled.tr<{ selected: boolean }>`
  background-color: ${props => (props.selected ? 'rgba(76, 175, 80, 0.1)' : 'transparent')};
`;

const PriorityBadge = styled.span<{ priority: string }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  background-color: ${props =>
    props.priority === 'high'
      ? 'rgba(255, 0, 0, 0.2)'
      : props.priority === 'medium'
      ? 'rgba(255, 165, 0, 0.2)'
      : 'rgba(76, 175, 80, 0.2)'};
  color: ${props =>
    props.priority === 'high' ? '#ff0000' : props.priority === 'medium' ? '#ffa500' : '#4CAF50'};
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  background-color: ${props => (props.status === 'open' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(128, 128, 128, 0.2)')};
  color: ${props => (props.status === 'open' ? '#4CAF50' : '#808080')};
`;

const ActionButton = styled.button`
  background-color: #4caf50;
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
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const CloseButton = styled.button`
  background-color: #ff0000;
  color: white;
  border: none;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
`;

const ModalBody = styled.div`
  p {
    margin: 10px 0;
  }
`;
