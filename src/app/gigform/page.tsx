'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Modal from './modal';
import Header from './header'; // Import the Header component

interface GigData {
  title: string;
  category: string;
  location: string;
  description: string;
  image: File | null;
}

interface CreateGigFormProps {
  onSubmit: (gig: GigData) => Promise<void>;
  categories: string[];
}

const CreateGigForm: React.FC<CreateGigFormProps> = ({ onSubmit, categories = [] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Example user data for Header
  const [user, setUser] = useState<User | null>(null); // Adjust based on your actual auth state
  const [skillPoints, setSkillPoints] = useState(100); // Example skill points, adjust as needed

  // Mock sign-in and sign-out functions
  const signIn = (email: string, password: string) => {
    // Example sign-in logic; replace with actual logic
    setUser({ email });
  };

  const signOut = () => {
    setUser(null);
  };

  // Ensure component only renders on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      {/* Include the Header at the top */}
      <Header 
        user={user} 
        skillPoints={skillPoints} 
        signIn={signIn} 
        signOut={signOut} 
      />

      {/* Button to trigger the modal */}
      <OpenModalButton onClick={toggleModal}>Create New Gig</OpenModalButton>

      {/* Conditionally render the Modal only after client has mounted */}
      {isClient && (
        <Modal
          isOpen={isModalOpen}
          onClose={toggleModal}
          onSubmit={onSubmit}
          categories={categories}
        />
      )}
    </>
  );
};

// Styled components for the button
const OpenModalButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  &:hover {
    background-color: #0056b3;
  }
`;

export default CreateGigForm;
