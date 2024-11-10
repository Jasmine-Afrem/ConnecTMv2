'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import Modal from './modal';
import Header from './header';

interface GigData {
  id: number;
  user_id: number;
  title: string;
  category: string;
  location: string;
  description: string;
  points: number;
  city: string;
  image_url?: string;
}

interface CreateGigFormProps {
  categories: string[];
}

export default function CreateGigForm({ categories = [] }: CreateGigFormProps) {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [gigs, setGigs] = useState<GigData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Function to handle user sign-out
  const signOut = async () => {
    try {
      document.cookie = "token=; path=/; domain=" + window.location.hostname + "; max-age=0; SameSite=Strict; Secure";
      setLoggedIn(false);
      setUserId(null);
      setEmail(null);
      await fetch('/api/users/logout', { method: 'POST', credentials: 'include' });
      router.push('/main');
    } catch (error) {
      console.error('Error during sign-out:', error);
    }
  };

  // Fetch gigs from your API
  const fetchGigs = async (userId: number) => {
    try {
      const response = await fetch('/api/gig', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to fetch gigs:', errorData.message);
        setError(errorData.message);
        return;
      }

      const data = await response.json();
      console.log('Fetched gigs:', data);

      // Filter gigs by authenticated user's userId
      const userGigs = data.gigs.filter((gig: GigData) => gig.user_id === userId);
      setGigs(userGigs);
    } catch (error) {
      console.error('Error fetching gigs:', error);
      setError('Failed to load gigs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Check authentication and fetch gigs if authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/protected', {
          method: 'GET',
          credentials: 'include',
        });

        const text = await response.text();
        const data = JSON.parse(text);

        if (response.ok && data.success) {
          setLoggedIn(true);
          setUserId(data.userId);
          setEmail(data.email);

          // Fetch gigs only after successfully getting the user ID
          fetchGigs(data.userId);
        } else {
          setLoggedIn(false);
          router.push('/main');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setLoggedIn(false);
        router.push('/main');
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    if (loggedIn) {
      setIsClient(true);
      setIsModalOpen(true);
    }
  }, [loggedIn]);

  if (loggedIn === null || loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {loggedIn ? (
        <>
          <Header
            user={{ id: String(userId ?? 0), email: email ?? '' }}
            skillPoints={100}
            signIn={() => {}}
            signOut={signOut}
          />

          <OpenModalButton onClick={() => setIsModalOpen(true)}>Create New Gig</OpenModalButton>

          {isClient && (
            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              categories={categories}
              userId={userId}
              fetchGigs={fetchGigs}
            />
          )}

          {/* Display fetched gigs */}
          {error ? (
            <ErrorMessage>{error}</ErrorMessage>
          ) : gigs.length > 0 ? (
            <GigList>
              {gigs.map((gig) => (
                <GigCard key={gig.id}>
                  <h3>{gig.title}</h3>
                  <p><strong>Category:</strong> {gig.category}</p>
                  <p><strong>Location:</strong> {gig.location}</p>
                  <p><strong>City:</strong> {gig.city}</p>
                  <p>{gig.description}</p>
                  <p><strong>Points:</strong> {gig.points}</p>
                  {gig.image_url && <img src={gig.image_url} alt={gig.title} />}
                  
                  {/* View Proposals Button */}
                  {isClient && (
                    <ViewProposalsButton onClick={() => router.push(`/proposal?gigId=${gig.id}`)}>
                      View Proposals
                    </ViewProposalsButton>
                  )}
                </GigCard>
              ))}
            </GigList>
          ) : (
            <p>No gigs found.</p>
          )}
        </>
      ) : (
        <h1>Redirecting...</h1>
      )}
    </>
  );
}

// Styled Components
const OpenModalButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 18px;
`;

const GigList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
`;

const GigCard = styled.div`
  background-color: #1e293b;
  color: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 300px;
  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
  }
`;

const ViewProposalsButton = styled.button`
  padding: 10px 15px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  &:hover {
    background-color: #388e3c;
  }
`;
