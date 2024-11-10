'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import Modal from './modal';
import Header from '@/app/main/header';
import Loading from '@/app/loading/loading';

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
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [gigs, setGigs] = useState<GigData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Mapping categories to their images
  const categoryImageMap: Record<string, string> = {
    'Web Development': 'https://cdn-icons-png.flaticon.com/512/11485/11485970.png',
    'Health & Wellness': 'https://cdn-icons-png.flaticon.com/512/2966/2966327.png',
    'Technology': 'https://png.pngtree.com/png-vector/20230316/ourmid/pngtree-coding-line-icon-vector-png-image_6652750.png',
    'Education': 'https://cdn-icons-png.flaticon.com/512/3778/3778120.png',
    'Entertainment': 'https://cdn-icons-png.freepik.com/256/16494/16494990.png',
    'Services': 'https://cdn-icons-png.flaticon.com/512/4269/4269480.png',
  };

  const signOut = async () => {
    try {
      document.cookie = "token=; path=/; domain=" + window.location.hostname + "; max-age=0; SameSite=Strict; Secure";
      setLoggedIn(false);
      setUserId(null);
      setEmail(null);
      setProfilePicture(null);
      await fetch('/api/users/logout', { method: 'POST', credentials: 'include' });
      router.push('/main');
    } catch (error) {
      console.error('Error during sign-out:', error);
    }
  };

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
      const userGigs = data.gigs.filter((gig: GigData) => gig.user_id === userId);
      setGigs(userGigs);
    } catch (error) {
      console.error('Error fetching gigs:', error);
      setError('Failed to load gigs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

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
          setProfilePicture(data.profilePicture);
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
    }
  }, [loggedIn]);

  if (loggedIn === null || loading) {
    return <Loading loading={true} />;
  }

  return (
    <>
      <PageWrapper>
        <ContentWrapper>
          <Header
            user={{ email, profilePicture }}
            signOut={signOut}
            signIn={() => router.push('/login')}
            eventStats={{ activeUsers: 0, totalEvents: 0 }}
            userId={userId ?? ''}
          />
          {loggedIn ? (
            <>
              {isClient && isModalOpen && (
                <Modal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  categories={categories}
                  userId={userId}
                  fetchGigs={fetchGigs}
                />
              )}

              {error ? (
                <ErrorMessage>{error}</ErrorMessage>
              ) : gigs.length > 0 ? (
                <>
                  <YourGigsMessage>Your gigs</YourGigsMessage>
                  <OpenModalButton onClick={() => setIsModalOpen(true)}>Create New Gig</OpenModalButton>
                  <GigsGrid>
                    {gigs.map((gig) => (
                      <GigCard key={gig.id}>
                        {/* Use categoryImageMap to select the correct image */}
                        <GigImage src={categoryImageMap[gig.category] || '/images/default.jpg'} alt={gig.category} />
                        <GigContent>
                          <GigCategory>{gig.category}</GigCategory>
                          <GigTitle>{gig.title}</GigTitle>
                          <GigDescription>{gig.description}</GigDescription>
                          <GigDetails>
                            <GigSkillPoints>{gig.points} SP</GigSkillPoints>
                          </GigDetails>
                          <ViewProposalsButton onClick={() => router.push(`/proposal?gigId=${gig.id}`)}>
                            View Proposals
                          </ViewProposalsButton>
                        </GigContent>
                      </GigCard>
                    ))}
                  </GigsGrid>
                </>
              ) : (
                <p>No gigs found.</p>
              )}
            </>
          ) : (
            <h1>Redirecting...</h1>
          )}
        </ContentWrapper>
      </PageWrapper>
    </>
  );
}

// Styled Components
const PageWrapper = styled.div`
  background-image: url('https://www.shutterstock.com/image-vector/business-job-icon-doodle-seamless-600nw-2285217401.jpg');
  background-size: auto;
  background-position: center;
  background-attachment: fixed;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
`;

const ContentWrapper = styled.div`
  background-color: transparent;
  padding: 40px 20px;
  border-radius: 10px;
  max-width: 1200px;
  width: 100%;
  color: white;
`;

const YourGigsMessage = styled.h2`
  background-color: rgba(15, 20, 84, 0.89);
  color: #dedede;
  font-size: 28px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20%;
  margin-left: auto;
  margin-right: auto;
  padding: 12px;
  border-radius: 32px;
  text-align: center;
  font-weight: 700;
`;

const OpenModalButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  margin-left: 5px;
  margin-bottom: 10px;
  background-color: rgba(15, 20, 84, 0.89);
  color: #fff;
  margin-top: 10px;
  border: none;
  cursor: pointer;
  border-radius: 24px;
  margin-left: auto;
  margin-right: auto;
  display: flex;  
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #383d70;
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 32px;
    text-shadow: 0 2px 4px #a6a2a2;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 18px;
`;

const GigsGrid = styled.div`
  display: grid;
  background-color: rgba(15, 20, 84, 0.89);
  border-radius: 26px;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  padding: 20px;
  @media (max-width: 991px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    padding: 15px;
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 10px;
  }
`;

const GigCard = styled.div`
  background-color: #dedede;
  border-radius: 16px;
  overflow: hidden;
  border: solid 2px;
  border-color: #232647;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
  transition: transform 0.2s ease;
  &:hover {
    transform: translateY(-5px);
  }
`;

const GigImage = styled.img`
  width: auto;
  height: 190px;
  object-fit: cover;
  background-size: contain;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto; 
`;

const GigContent = styled.div`
  padding: 15px;
  background-color: #1e293b;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 290px; /* Set a fixed height for consistency */
  min-height: 290px; /* Ensure it doesn't shrink below this value */
  overflow: hidden; /* Prevent overflowing content */
`;

const GigCategory = styled.p`
  font-size: 14px;
  color: #a6a2a2;
  padding-bottom: 12px;
`;

const GigTitle = styled.h3`
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 10px;
  overflow: hidden; /* In case of long titles */
  text-overflow: ellipsis; /* Truncate long titles with an ellipsis */
  white-space: nowrap; /* Prevent text from wrapping */
`;

const GigDescription = styled.p`
  font-size: 16px;
  color: #f5f5f5;
  padding-top: 12px;
  padding-bottom: 12px;
  flex-grow: 1; /* Allow description to grow and take up space */
  overflow: hidden; /* Prevent text from overflowing */
  text-overflow: ellipsis; /* Truncate long descriptions */
  display: -webkit-box;
  -webkit-line-clamp: 3; /* Limit the description to 3 lines */
  -webkit-box-orient: vertical;
`;

const GigDetails = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  padding-bottom: 10px;
`;

const GigSkillPoints = styled.span`
  font-size: 14px;
  color: #a6a2a2;
  padding-bottom: 12px;
`;

const ViewProposalsButton = styled.button`
  background-color: #dedede;
  color: #293691;
  border: solid 2px #293691;
  border: none;
  padding: 10px 15px;
  font-size: 14px;
  border-radius: 32px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #b5b5b5;
  }
`;
