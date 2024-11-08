'use client';

import React from 'react';
import styled from 'styled-components';

interface SubmitButtonProps {
  loading: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ loading }) => (
  <ButtonContainer>
    <Button type="submit" disabled={loading}>
      {loading ? 'Creating...' : 'Create Gig'}
    </Button>
  </ButtonContainer>
);

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;  /* Make sure the container takes up full width to center the button */
  margin-top: 20px; /* Optional, you can adjust this for spacing */
`;

const Button = styled.button`
  padding: 10px 24px;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.3px;

  &:hover {
    background-color: #1d4ed8;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;
