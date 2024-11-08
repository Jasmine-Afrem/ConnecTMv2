'use client';

import React, { ChangeEvent } from 'react';
import styled from 'styled-components';

interface ImageUploadProps {
  label: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  previewImage: string | null;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ label, onChange, previewImage }) => (
  <FieldContainer>
    <Label htmlFor="image-upload">{label}</Label>
    <Input
      type="file"
      id="image-upload"
      accept="image/*"
      onChange={onChange}
    />
    {previewImage && <Preview src={previewImage} alt="Preview" />}
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
  margin-bottom: 10px;
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

const Preview = styled.img`
  max-width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
`;