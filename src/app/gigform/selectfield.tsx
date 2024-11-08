'use client';

import React, { ChangeEvent } from 'react';
import styled from 'styled-components';

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  required?: boolean;
}

export const SelectField: React.FC<SelectFieldProps> = ({ label, name, value, onChange, options, required }) => (
  <FieldContainer>
    <Label htmlFor={name}>{label}</Label>
    <Select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
    >
      <option value="">Select a category</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </Select>
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

const Select = styled.select`
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