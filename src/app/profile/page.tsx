'use client';

import { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import ProfileImageUploader from './profileimageuploader';
import FormField from './formfield';
import Button from './button';
import Image from 'next/image';
import Link from 'next/link';
import Loading from '@/app/loading/loading'; // Import the Loading component

interface Profile {
  user_id: number;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  bio: string;
  profile_image_url: string | null;
  skills: string; // Skills as a string
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
    skills: '', // Add skills field in form data
  });
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null);

  // Check user authentication on mount
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
      } catch (error: unknown) {
        if (error instanceof Error) {
          setLoggedIn(false);
          alert('Error checking authentication:' + error.message);
        } else {
          alert('Malakai: Something went wrong');
        }
      }
    };

    checkAuth();
  }, []);

  // Fetch profile data once the user is authenticated
  const fetchProfile = useCallback(async () => {
    if (!userId) return;

    setLoading(true); // Start loading when fetching profile
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
          skills: data.profile.skills || '', // Ensure skills is handled as a string
        });
      } else {
        setError('Profile not found.');
      }
    } catch (err) {
      setError('Failed to fetch profile data.');
      console.error(err);
    } finally {
      setLoading(false); // Stop loading after fetching is complete
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

    setLoading(true); // Start loading when updating profile
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
          skills: formData.skills, // Include skills in update request
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
      setLoading(false); // Stop loading after update is complete
    }
  };

  // Show the Loading component while loading is true
  if (loading) {
    return <Loading loading={true} />; // Show loading component
  }

  return (
    <>
      <BackgroundWrapper />
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
            <FormField
              label="Skills"
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="Skills"
            />
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <ButtonWrapper>
              <StyledButton type="submit">Save Changes</StyledButton>
            </ButtonWrapper>
            <ActionButtons>
              <Link href="./main">
                <StyledActionButton>Main</StyledActionButton>
              </Link>
            </ActionButtons>
          </Form>
        </ProfileFormContainer>
      </ProfileSettingsContainer>
    </>
  );
};

const BackgroundWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #424a59;
  background-image: url('https://www.shutterstock.com/image-vector/business-job-icon-doodle-seamless-600nw-2285217401.jpg');
  z-index: -1;
`;

const ProfileSettingsContainer = styled.section`
  max-width: 90%;
  margin: 20px auto;
  padding: 30px;
  background-color: rgba(15, 20, 84, 0.97);
  border-radius: 32px;
  width: 50%;
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
  font-size: 24px;
  font-weight: 1600;
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
    border-radius: 50%;
    width: 60px;
    height: 60px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ButtonWrapper = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: center;
`;

const StyledButton = styled(Button)`
  padding: 15px 32px;
  font-size: 16px;
`;

const ActionButtons = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledActionButton = styled(Button)`
  margin-top: 20px;
  padding: 15px 32px;
  font-size: 16px;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  text-align: center;
`;

export default ProfilePage;