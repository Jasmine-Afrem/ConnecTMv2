'use client';

import React from 'react';
import styled from 'styled-components';

interface ButtonProps {
  type: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ type, disabled, children }) => {
  return (
    <StyledButton type={type} disabled={disabled}>
      {children}
    </StyledButton>
  );
};

const StyledButton = styled.button`
  width: 100%;
  padding: 18px 28px;
  background-color: #ffff;
  color: #3d50d4;
  border-radius: 32px;
  font-size: 16px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #ffff, #ffff);
  background-size: 400% 400%;
  animation: gradient 8s ease infinite;
  letter-spacing: 0.3px;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.5), 0 2px 4px -1px rgba(59, 130, 246, 0.06);
  margin-top: 16px;

  &:disabled {
    opacity: 0.8;
    cursor: not-allowed;
    transform: scale(0.98);
  }

  &:not(:disabled):hover {
    transform: translateY(-2px);
    background-color: #dedede;
    box-shadow: 0 6px 8px -2px rgba(59, 130, 246, 0.6), 0 4px 6px -1px rgba(59, 130, 246, 0.1);
  }

  &:not(:disabled):active {
    transform: translateY(0);
    background-color: #dedede;
    box-shadow: 0 2px 4px -1px rgba(59, 130, 246, 0.4), 0 1px 2px -1px rgba(59, 130, 246, 0.04);
  }

  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;