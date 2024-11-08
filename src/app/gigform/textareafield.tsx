'use client';

import React, { ChangeEvent } from 'react';
import styled from 'styled-components';

interface TextAreaFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({ label, name, value, onChange, required }) => (
  <FieldContainer>
    <Label htmlFor={name}>{label}</Label>
    <TextArea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      rows={4}
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

const TextArea = styled.textarea`
  padding: 8px;
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.12);
  resize: vertical;
  background-color: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.3);
  }
`;