'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { InputField } from './inputfield';
import { TextAreaField } from './textareafield';
import { SelectField } from './selectfield';
import { ImageUpload } from './imageupload';
import { SubmitButton } from './submitbutton';

interface NewGig {
  title: string;
  category: string;
  location: string;
  description: string;
  image: File | null;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (gig: NewGig) => Promise<void>;
  categories: string[];
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit, categories }) => {
  const [newGig, setNewGig] = useState<NewGig>({
    title: '',
    category: '',
    location: '',
    description: '',
    image: null,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewGig(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewGig(prev => ({ ...prev, image: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await onSubmit(newGig);
      setSuccessMessage('Gig created successfully!');
      setNewGig({
        title: '',
        category: '',
        location: '',
        description: '',
        image: null,
      });
      setPreviewImage(null);
    } catch {
      setError('Failed to create gig. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <Backdrop onClick={onClose} />

      {/* Modal Content */}
      <ModalOverlay>
        <ModalContainer>
          <CloseButton onClick={onClose}>×</CloseButton>
          {/* The modal itself is now the form container */}
          <form onSubmit={handleSubmit}>
            <FormTitle>Create a New Gig</FormTitle>
            <InputField
              label="Title"
              name="title"
              value={newGig.title}
              onChange={handleInputChange}
              required
            />
            <SelectField
              label="Category"
              name="category"
              value={newGig.category}
              onChange={handleInputChange}
              options={categories.length > 0 ? categories : ['No categories available']}
              required
            />
            <InputField
              label="Location"
              name="location"
              value={newGig.location}
              onChange={handleInputChange}
              required
            />
            <TextAreaField
              label="Description"
              name="description"
              value={newGig.description}
              onChange={handleInputChange}
              required
            />
            <ImageUpload
              label="Image"
              onChange={handleImageUpload}
              previewImage={previewImage}
            />
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
            <SubmitButton loading={loading} />
          </form>
        </ModalContainer>
      </ModalOverlay>
    </>
  );
};

// Styled components for the modal

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  z-index: 998;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContainer = styled.div`
  background-color: #1e293b;
  border-radius: 8px;
  padding: 20px;
  max-width: 500px;
  width: 100%;
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  color: #ffff;
  background: none;
  border: none;
  cursor: pointer;
`;

const FormTitle = styled.h1`
  font-size: 28px;
  margin-bottom: 30px;
  text-align: center;
  color: #ffffff;
  font-weight: 600;
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  font-size: 14px;
  margin-top: 10px;
`;

const SuccessMessage = styled.div`
  color: #51cf66;
  font-size: 14px;
  margin-top: 10px;
`;

export default Modal;