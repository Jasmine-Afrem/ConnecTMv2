'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { InputField } from './inputfield';
import { TextAreaField } from './textareafield';
import { ImageUpload } from './imageupload';
import { SubmitButton } from './submitbutton';

interface NewGig {
  title: string;
  category: string;
  location: string;
  city: string;
  description: string;
  image: File | null;
  points: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (gig: NewGig) => Promise<void>;
  categories: string[];
  userId: number | null;
  fetchGigs: (userId: number) => Promise<void>; // Add this line to pass the function
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit, categories, userId, fetchGigs }) => {
  const [newGig, setNewGig] = useState<NewGig>({
    title: '',
    category: '',
    location: '',
    city: '',
    description: '',
    image: null,
    points: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  if (!isOpen || userId === null) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewGig(prev => ({
      ...prev,
      [name]: value,
    }));
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
  
    if (!userId) {
      setError('User not authenticated.');
      setLoading(false);
      return;
    }
  
    try {
      if (onSubmit) {
        await onSubmit(newGig);
      } else {
        await sendGigToDatabase(newGig, userId);
      }
  
      // Fetch updated gigs after submitting the new gig
      if (fetchGigs && userId) {
        await fetchGigs(userId); // Fetch the gigs after creating the new one
      }
  
      setSuccessMessage('Gig created successfully!');
      setNewGig({
        title: '',
        category: '',
        location: '',
        city: '',
        description: '',
        image: null,
        points: '',
      });
      setPreviewImage(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create gig. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };  

  const sendGigToDatabase = async (gig: NewGig, userId: number) => {
    const data = {
      userId,
      title: gig.title,
      description: gig.description,
      points: gig.points,
      location: gig.location,
      city: gig.city,
      category: gig.category,
      image: gig.image ? await convertImageToBase64(gig.image) : null,
    };

    const response = await fetch('/api/gig', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || 'Failed to create gig');
    }

    return await response.json();
  };

  const convertImageToBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const defaultCategories = [
    'All Categories',
    'Health & Wellness',
    'Technology',
    'Education',
    'Entertainment',
    'Services',
  ];

  const categoriesToUse = categories.length > 0 ? categories : defaultCategories;

  return (
    <>
      <Backdrop onClick={onClose} />
      <ModalOverlay>
        <ModalContainer>
          <CloseButton onClick={onClose}>×</CloseButton>
          <form onSubmit={handleSubmit}>
            <FormTitle>Create a New Gig</FormTitle>
            <InputField label="Title" name="title" value={newGig.title} onChange={handleInputChange} required />
            <InputField label="Skill Points" name="points" value={newGig.points} onChange={handleInputChange} required />
            <SelectContainer>
              <label htmlFor="category">Category</label>
              <StyledSelect id="category" name="category" value={newGig.category} onChange={handleInputChange} required>
                {categoriesToUse.map((option) => (
                  <StyledOption key={option} value={option}>
                    {option}
                  </StyledOption>
                ))}
              </StyledSelect>
            </SelectContainer>
            <InputField label="Location" name="location" value={newGig.location} onChange={handleInputChange} required />
            <InputField label="City" name="city" value={newGig.city} onChange={handleInputChange} required />
            <TextAreaField label="Description" name="description" value={newGig.description} onChange={handleInputChange} required />
            <ImageUpload label="Image" onChange={handleImageUpload} previewImage={previewImage} />
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
            <SubmitButton loading={loading} />
          </form>
        </ModalContainer>
      </ModalOverlay>
    </>
  );
};

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
  color: #ffffff;
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

const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  color: #ffffff;
`;

const StyledSelect = styled.select`
  padding: 12px;
  background-color: #334155;
  color: #ffffff;
  border: 2px solid #6366f1;
  border-radius: 4px;
  outline: none;
  font-size: 16px;
  cursor: pointer;
  transition: border-color 0.3s, background-color 0.3s;

  &:hover {
    background-color: #3b4252;
    border-color: #4f46e5;
  }

  &:focus {
    border-color: #4f46e5;
  }
`;

const StyledOption = styled.option`
  background-color: #334155;
  color: #ffffff;
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
