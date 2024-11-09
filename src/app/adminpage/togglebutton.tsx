'use client';

import React from 'react';
import styled from 'styled-components';

interface ToggleButtonProps {
  onClick: () => void;
  isOpen: boolean;
  label: string;
}

export const ToggleButton: React.FC<ToggleButtonProps> = ({ onClick, isOpen, label }) => {
  return (
    <StyledButton onClick={onClick} aria-expanded={isOpen} aria-label={label}>
      {isOpen ? '▼' : '▶'} {label}
    </StyledButton>
  );
};

const StyledButton = styled.button`
  background-color: transparent;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
`;