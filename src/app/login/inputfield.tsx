'use client';

import React from 'react';
import styled from 'styled-components';

interface InputFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  value,
  onChange,
  placeholder,
  required = false,
}) => {
  return (
    <InputWrapper>
      <Label htmlFor={`input-${label}`}>{label}</Label>
      <Input
        id={`input-${label}`}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </InputWrapper>
  );
};

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  position: relative;
  width: 100%;
`;

const Label = styled.label`
  color: #ffffff;
  font-size: 16px;
`;

const Input = styled.input`
  width: 100%;
  padding: 24px 28px;
  max-height:60px;
  background-color: #fff;
  border: 2px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  color: #3d50d4;
  font-size: 16px;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 0.3px;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
    
`;