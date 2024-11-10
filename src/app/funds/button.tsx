'use client';

import React from 'react';
import styled from 'styled-components';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  primary?: boolean;
  secondary?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ onClick, children, primary, secondary }) => {
  return (
    <StyledButton onClick={onClick} $primary={primary} $secondary={secondary}>
      {children}
    </StyledButton>
  );
};

const StyledButton = styled.button<{ $primary?: boolean; $secondary?: boolean }>`
  background-color: ${props => props.$primary ? '#4caf50' : props.$secondary ? '#31377a' : '#4caf50'};
  color: white;
  padding: 12px 24px;
  border: ${props => props.$secondary ? '1px solid rgba(255, 255, 255, 0.2)' : 'none'};
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 400;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${props => props.$primary ? '#45a049' : props.$secondary ? 'rgba(255, 255, 255, 0.2)' : '#45a049'};
  }

  &:focus {
    outline: none;
    font-weight: 900;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.5);
  }
`;