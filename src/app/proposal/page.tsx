'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Loading from '@/app/loading/loading';
import styled from 'styled-components';

interface Profile {
  first_name: string;
  last_name: string;
  bio: string;
  profile_image_url: string | null;
  skills: string;
}

export default function ProposalPage() {
  const searchParams = useSearchParams();
  const gigId = searchParams.get('gigId');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [message, setMessage] = useState('');
  const [applicantId, setApplicantId] = useState<number | null>(null);

  // Fetch profile data
  const fetchProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const userId = 25;
      const response = await fetch(`/api/profile?userId=${userId}`);
      const data = await response.json();

      if (data.profile) {
        setProfile(data.profile);
      } else {
        setError('Profile not found.');
      }
    } catch (err) {
      setError('Failed to fetch profile data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Add applicant
  const handleAddApplicant = async () => {
    try {
      const userId = 1; // Replace with actual userId logic
      const response = await fetch('/api/applicants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task_id: gigId, user_id: userId, message }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Successfully applied!');
        setApplicantId(data.id);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to add applicant.');
    }
  };

  // Remove applicant
  const handleRemoveApplicant = async () => {
    try {
      const response = await fetch('/api/applicants', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: applicantId }),
      });

      if (response.ok) {
        alert('Application removed.');
        setApplicantId(null);
      } else {
        setError('Failed to remove application.');
      }
    } catch (err) {
      setError('Error removing applicant.');
    }
  };

  // Accept applicant
  const handleAcceptApplicant = async () => {
    try {
      const userId = 1; // Replace with actual userId logic
      const response = await fetch('/api/applicants', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task_id: gigId, user_id: userId }),
      });

      if (response.ok) {
        alert('Applicant accepted successfully.');
      } else {
        setError('Failed to accept applicant.');
      }
    } catch (err) {
      setError('Error accepting applicant.');
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <h1>Proposals for Gig ID {gigId}</h1>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {profile ? (
        <ProfileContainer>
          <h2>
            {profile.first_name} {profile.last_name}
          </h2>
          {profile.profile_image_url && (
            <ProfileImage src={profile.profile_image_url} alt="Profile Image" />
          )}
          <p>{profile.bio}</p>
          <p>
            <strong>Skills:</strong> {profile.skills}
          </p>

          {/* Add Applicant Form */}
          <ApplicantForm>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your proposal message"
            />
            <Button onClick={handleAddApplicant}>Apply for Gig</Button>
            <Button onClick={handleRemoveApplicant} disabled={!applicantId}>
              Remove Application
            </Button>
            <Button onClick={handleAcceptApplicant}>Accept Applicant</Button>
          </ApplicantForm>
        </ProfileContainer>
      ) : (
        <p>No profile data available.</p>
      )}
    </div>
  );
}

const ProfileContainer = styled.div`
  margin-top: 20px;
  padding: 10px;
  background-color: rgba(15, 20, 84, 0.97);
  border-radius: 8px;
  color: white;
`;

const ProfileImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
`;

const ApplicantForm = styled.div`
  margin-top: 20px;
`;

const Button = styled.button`
  margin-top: 10px;
  padding: 10px;
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #005bb5;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  text-align: center;
`;
