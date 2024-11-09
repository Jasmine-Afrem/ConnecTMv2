import React from "react";
import styled from "styled-components";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}

const StyledButton = styled.button<ButtonProps>`
  background-color: #4caf50;
  color: white;
  padding: 10px;
  border-radius: 25px;
  cursor: pointer;
  border: none;
  font-size: 16px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049;
  }

  &.logout-button,
  &.delete-button {
    background-color: rgba(255, 68, 68, 0.15);
    color: rgba(255, 68, 68, 1);
    border: 1px solid rgba(255, 68, 68, 0.8);

    &:hover {
      background-color: rgba(255, 68, 68, 0.25);
    }
  }
`;

const Button: React.FC<ButtonProps> = ({ onClick, className, children, ...rest }) => {
  return (
    <StyledButton onClick={onClick} className={className} {...rest}>
      {children}
    </StyledButton>
  );
};

export default Button;
