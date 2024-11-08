'use client';

import React, { ChangeEvent } from 'react';
import styled from 'styled-components';

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({ label, name, value, onChange, required }) => (
  <FieldContainer>
    <Label htmlFor={name}>{label}</Label>
    <Input
      type="text"
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
    />
  </FieldContainer>
);

const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-weight: 500;
  color: #ffffff;
`;

const Input = styled.input`
  padding: 8px;
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.12);
  background-color: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.3);
  }
`;