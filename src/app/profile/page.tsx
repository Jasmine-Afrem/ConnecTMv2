/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import ProfileImageUploader from './profileimageuploader';
import FormField from './formfield';
import Button from './button';
import Image from 'next/image';

interface Profile {
  user_id: number;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  bio: string;
  profile_image_url: string | null;
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    bio: '',
    profileImageUrl: '',
  });
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/protected', {
          method: 'GET',
          credentials: 'include',
        });

        const data = await response.json();
        
        if (response.ok && data.success) {
          setUserId(data.userId);
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
          alert(data.message);
        }
      } catch (error : unknown) {
        if(error instanceof Error)
        {
          setLoggedIn(false);
          alert('Error checking authentication:' + error.message);
        }
        else
        {
          alert('Malakai: Something went wrong');
        }
      }
    };

    checkAuth();
  }, []);

  const fetchProfile = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/profile?userId=${userId}`);
      const data = await response.json();
      
      if (data.profile) {
        setProfile(data.profile);
        setFormData({
          firstName: data.profile.first_name || '',
          lastName: data.profile.last_name || '',
          phone: data.profile.phone || '',
          address: data.profile.address || '',
          bio: data.profile.bio || '',
          profileImageUrl: data.profile.profile_image_url || '',
        });
      } else {
        setError('Profile not found.');
      }
    } catch (err) {
      setError('Failed to fetch profile data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [fetchProfile, userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName) {
      setError('First Name and Last Name are required.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          address: formData.address,
          bio: formData.bio,
          profileImageUrl: formData.profileImageUrl,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Profile updated successfully');
        fetchProfile(); // Refresh profile
      } else {
        setError(data.error || 'Failed to update profile.');
      }
    } catch (err) {
      setError('Error updating profile.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/profile?userId=${userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Profile deleted successfully');
        setProfile(null); // Clear the profile
      } else {
        setError(data.error || 'Failed to delete profile.');
      }
    } catch (err) {
      setError('Error deleting profile.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Implement logout functionality
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <ProfileSettingsContainer>
        <ProfileSettingsTitle>Profile Settings</ProfileSettingsTitle>
        <ProfileFormContainer>
          <ProfileImageWrapper>
            {profile?.profile_image_url && (
              <Image
                src={profile.profile_image_url}
                alt="Profile"
                className="profile-image"
                width={60}
                height={60}
                objectFit="cover"
              />
            )}
          </ProfileImageWrapper>
          <ProfileImageUploader />

          <Form className="settings-form" onSubmit={handleUpdate}>
            <FormField
              label="First Name"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
            />
            <FormField
              label="Last Name"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
            />
            <FormField
              label="Phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
            />
            <FormField
              label="Address"
              type="textarea"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
            />
            <FormField
              label="Bio"
              type="textarea"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself"
            />
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <ButtonWrapper>
              <StyledButton type="submit">Save Changes</StyledButton>
            </ButtonWrapper>
            <ActionButtons>
              <StyledActionButton onClick={handleLogout} className="logout-button">Log Out</StyledActionButton>
              <StyledActionButton onClick={handleDelete} className="delete-button">Delete Account</StyledActionButton>
            </ActionButtons>
          </Form>
        </ProfileFormContainer>
      </ProfileSettingsContainer>
    </>
  );
};

// Styled components
const ProfileSettingsContainer = styled.section`
  max-width: 90%;
  margin: 20px auto;
  padding: 30px;
  background-color: #1e293b;
  border-radius: 16px;
  width: 100%;
  max-width: 1200px;
  color: white;
  text-align: left;

  @media (max-width: 640px) {
    padding: 15px;
    width: 100%;
    margin: 20px;
  }
`;

const ProfileSettingsTitle = styled.h1`
  font-size: 16px;
  font-weight: 1000;
  color: #ffffff;
  margin-bottom: 20px;
  text-align: left;
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, #fafcff, #c9ccd1);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ProfileFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  flex-grow: 1;
  padding: 0 10px;
`;

const ProfileImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;

  .profile-image {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 800px;
  flex-grow: 1;
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 10px;
  margin-top: 8px;
  padding: 8px 12px;
  background-color: rgba(239, 68, 68, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 20px;
  justify-content: center;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const StyledButton = styled(Button)`
  width: 130px;
  border-radius: 20px;
`;

const StyledActionButton = styled(Button)`
  flex: 1;
  width: 100px;
  border-radius: 20px;
`;

export default ProfilePage;
