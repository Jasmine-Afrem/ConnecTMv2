import React from "react";
import styled from "styled-components";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}

const StyledButton = styled.button<ButtonProps>`
  background-color: #dedede;
  color: #293691;
  padding: 10px;
  border-radius: 25px;
  cursor: pointer;
  border: none;
  font-size: 16px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #b5b5b5;
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
