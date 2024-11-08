'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import Modal from './modal'; // Importing the Modal component

interface CreateGigFormProps {
  onSubmit: (gig: any) => Promise<void>;
  categories: string[];
}

const CreateGigForm: React.FC<CreateGigFormProps> = ({ onSubmit, categories = [] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      {/* Button to trigger the modal */}
      <OpenModalButton onClick={toggleModal}>Create New Gig</OpenModalButton>

      {/* Modal Component with the form inside */}
      <Modal
        isOpen={isModalOpen}
        onClose={toggleModal}
        onSubmit={onSubmit}
        categories={categories}
      />
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
