import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

interface User {
  id: string;
  name: string;
  email: string;
  active: boolean;
  isAdmin: boolean;
  ticketCount: number;
  funds: number;
}

export const UserTable: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // State for selected user
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/admin/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data.users); // Assuming data.users is an array of users
      } catch (error) {
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const openUserDetails = (user: User) => {
    setSelectedUser(user); // Set the selected user
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedUser(null); // Reset selected user
  };

  const handleAdminToggle = async () => {
    if (selectedUser) {
      // Here, we simulate an API call to update the user's admin status
      const updatedUser = { ...selectedUser, isAdmin: !selectedUser.isAdmin };
      setSelectedUser(updatedUser);
      // Perform actual API call to update admin status in the backend
      await fetch(`/api/admin/users/${updatedUser.id}/toggle-admin`, { method: 'POST' });
    }
  };

  const handlePasswordChange = async () => {
    if (selectedUser) {
      // Trigger the password change functionality (send request to API or show a form)
      alert(`Password change request sent to ${selectedUser.name}`);
    }
  };

  const handleTicketCountChange = async (newCount: number) => {
    if (selectedUser) {
      const updatedUser = { ...selectedUser, ticketCount: newCount };
      setSelectedUser(updatedUser);
      // Update ticket count in the backend
      await fetch(`/api/admin/users/${updatedUser.id}/update-tickets`, {
        method: 'POST',
        body: JSON.stringify({ ticketCount: newCount }),
      });
    }
  };

  const handleFundsChange = async (newFunds: number) => {
    if (selectedUser) {
      const updatedUser = { ...selectedUser, funds: newFunds };
      setSelectedUser(updatedUser);
      // Update funds in the backend
      await fetch(`/api/admin/users/${updatedUser.id}/update-funds`, {
        method: 'POST',
        body: JSON.stringify({ funds: newFunds }),
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`/api/admin/users?id=${userId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete user');
        }
        setUsers(users.filter(user => user.id !== userId));
      } catch (error) {
        alert('Failed to delete user');
      }
    }
  };

  return (
    <TableContainer>
      <SearchInput
        type="text"
        placeholder="Search users by name or email..."
        aria-label="Search users"
      />
      {error && <ErrorText>{error}</ErrorText>}
      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <th>Select</th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6}>Loading...</td>
              </tr>
            ) : (
              users.map(user => (
                <TableRow key={user.id} selected={selectedUsers.includes(user.id)}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                      aria-label={`Select ${user.name}`}
                    />
                  </td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <StatusBadge active={user.active}>
                      {user.active ? 'Active' : 'Inactive'}
                    </StatusBadge>
                  </td>
                  <td>
                    <ActionButton onClick={() => openUserDetails(user)}>
                      View Details
                    </ActionButton>
                  </td>
                  <td>
                    <DeleteButton onClick={() => handleDeleteUser(user.id)}>
                      Delete
                    </DeleteButton>
                  </td>
                </TableRow>
              ))
            )}
          </tbody>
        </Table>
      </TableWrapper>

      {/* Modal for User Details */}
      {isModalOpen && selectedUser && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <h3>User Details</h3>
              <CloseButton onClick={closeModal}>X</CloseButton>
            </ModalHeader>
            <ModalBody>
              <p><strong>User ID:</strong> {selectedUser.id}</p>
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Status:</strong> {selectedUser.active ? 'Active' : 'Inactive'}</p>
              <p><strong>Admin Status:</strong> {selectedUser.isAdmin ? 'Admin' : 'User'}</p>
              <div>
                <label htmlFor="funds">Funds:</label>
                <FundsInput
                  type="number"
                  id="funds"
                  value={selectedUser.funds}
                  onChange={(e) => handleFundsChange(Number(e.target.value))}
                  min={0}
                />
              </div>
            </ModalBody>

            <ModalActions>
              <ActionButton onClick={handleAdminToggle}>
                Toggle Admin Status
              </ActionButton>
              <ActionButton onClick={handlePasswordChange}>
                Request Password Change
              </ActionButton>
            </ModalActions>
          </ModalContent>
        </Modal>
      )}
    </TableContainer>
  );
};

// Styled Components
const TableContainer = styled.div`
  margin-bottom: 40px;
  border-radius: 18px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-color: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 14px;
  margin-bottom: 20px;
`;

const ErrorText = styled.p`
  color: red;
  font-size: 14px;
  margin-bottom: 10px;
`;

const TableWrapper = styled.div`
  max-height: 400px; /* Adjust the height as needed */
  overflow-y: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

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
`;

const TableRow = styled.tr<{ selected: boolean }>`
  background-color: ${props => (props.selected ? 'rgba(76, 175, 80, 0.1)' : 'transparent')};
`;

const StatusBadge = styled.span<{ active: boolean }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  background-color: ${props => (props.active ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 0, 0, 0.2)')};
  color: ${props => (props.active ? '#4CAF50' : '#ff0000')};
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

const DeleteButton = styled.button`
  background-color: #ad0000;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
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

const ModalActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const FundsInput = styled.input`  
  background-color: #dedede;
  border: solid 1px #dedede;
  border-radius: 12px;
`;
