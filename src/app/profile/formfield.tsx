'use client';

import React from 'react';
import styled from 'styled-components';

interface FormFieldProps {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder: string;
  required?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  required = false,
}) => {
  const inputId = `input-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <FieldContainer>
      <Label htmlFor={inputId}>{label}</Label>
      {type === 'textarea' ? (
        <StyledTextarea
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
        />
      ) : (
        <StyledInput
          id={inputId}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
        />
      )}
    </FieldContainer>
  );
};

const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
`;

const Label = styled.label`
  color: #ffffff;
  font-size: 15px;
  font-weight: 700px;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  max-height: 50px;
  background-color: #dedede;
  border: 2px solid #31377a;
  border-radius: 12px;
  color: #31377a;
  font-size: 14px;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 0.3px;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 8px 12px;
  min-height: 80px;
  background-color: #dedede;
  border: 2px solid #31377a;
  border-radius: 12px;
  color: #31377a;
  font-size: 14px;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

export default FormField;