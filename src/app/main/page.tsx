'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import Header from './header';
import PromotionalPanel from './promotionalpanel';
import SearchSection from './searchsection';
import AvailableGigs from './availablegigs';
import ContactAndMapSection from './contactandmapsection';
import HelpPrompt from './prompt';
import { useRouter } from 'next/navigation';
import Loading from '@/app/loading/loading'; // Import the Loading component

interface User {
  email: string;
  id: string;
  profilePicture?: string;
}

interface EventStats {
  activeUsers: number;
  totalEvents: number;
}

interface Gig {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  points: number;
  imageUrl: string;
  duration: string;
  problemOwner: string;
}

const SkillSharePlatform: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [eventStats, setEventStats] = useState<EventStats>({ activeUsers: 0, totalEvents: 0 });
  const [location, setLocation] = useState<string>('');
  const [searchRadius, setSearchRadius] = useState<number>(10);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [loading, setLoading] = useState(true); // Combined loading state
  const [userId, setUserId] = useState<string | null>(null);
  const [gigs, setGigs] = useState<Gig[]>([]); // Store all gigs
  const router = useRouter();

  // Check if user is logged in using JWT
  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/protected', {
        method: 'GET',
        credentials: 'include',
      });

      const text = await response.text();
      const data = JSON.parse(text);

      if (response.ok && data.success) {
        setUser({ email: data.email, id: data.userId, profilePicture: data.profilePicture });
        setIsLoggedIn(true);
        setUserId(data.userId);
        updateEventStats(true);
      } else {
        setIsLoggedIn(false);
        setUser(null);
        alert(data.message);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert('Error checking authentication: ' + error.message);
      } else {
        alert('Unknown error: ' + String(error));
      }
      setIsLoggedIn(false);
    }
  }, []);

  // Fetch event stats or any additional data here
  const fetchEventStats = useCallback(async () => {
    try {
      const response = await fetch('/api/eventStats');
      const data = await response.json();
      setEventStats(data);
    } catch (error) {
      console.error('Error fetching event stats:', error);
    }
  }, []);

  // Fetch available gigs
  const fetchGigs = useCallback(async () => {
    try {
      const response = await fetch('/api/gig');
      if (response.ok) {
        const data = await response.json();
        setGigs(data.gigs); // Assuming the response contains a 'gigs' array
      } else {
        console.error('Failed to fetch gigs');
      }
    } catch (error) {
      console.error('Error fetching gigs:', error);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await checkAuth();
      await fetchEventStats();
      await fetchGigs();
      setLoading(false); // Set loading to false once all data is fetched
    };

    fetchData();
  }, [checkAuth, fetchEventStats, fetchGigs]);

  const updateEventStats = (isLoggedIn: boolean) => {
    setEventStats(prevStats => ({
      activeUsers: isLoggedIn ? prevStats.activeUsers + 1 : prevStats.activeUsers - 1,
      totalEvents: prevStats.totalEvents,
    }));
  };

  const signOut = async () => {
    try {
      document.cookie = "token=; path=/; domain=" + window.location.hostname + "; max-age=0; SameSite=Strict; Secure";
      setUser(null);
      setIsLoggedIn(false);
      updateEventStats(false);
      await fetch('/api/users/logout', { method: 'POST', credentials: 'include' });
      router.push('/main');
    } catch (error) {
      console.error('Error during sign-out:', error);
    }
  };  

  const signIn = () => {
    router.push('/login');
  };

  // Show loading spinner while checking authentication or fetching data
  if (loading) {
    return <Loading loading={true} />; // Show the loading screen while waiting for auth and data
  }

  return (
    <StyledSkillSharePlatform>
      <StyledTaskMarketplace>
        <Header
          user={user}
          signOut={signOut}
          signIn={signIn}
          eventStats={eventStats}
          userId={userId ?? ''}
        />
        
        {/* Show PromotionalPanel only when not logged in */}
        {!isLoggedIn && <PromotionalPanel eventStats={eventStats} />}

        {/* Only render HelpPrompt when logged in */}
        {isLoggedIn && <HelpPrompt onCreateGig={() => router.push('/gigform')} />}

        {/* Show SearchSection and AvailableGigs only when logged in */}
        {isLoggedIn && (
          <>
            <SearchSection
              location={location}
              setLocation={setLocation}
              searchRadius={searchRadius}
              setSearchRadius={setSearchRadius}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
            <AvailableGigs gigs={gigs} userId={userId ?? ''} />
          </>
        )}

        <ContactAndMapSection />
      </StyledTaskMarketplace>
    </StyledSkillSharePlatform>
  );
};  

// Styled Components
const StyledSkillSharePlatform = styled.div`
  background-color: #424a59;
  background-image: url('https://www.shutterstock.com/image-vector/business-job-icon-doodle-seamless-600nw-2285217401.jpg'); /* Correct URL */
  background-size: auto;
  background-position: center;
  background-attachment: fixed;
  min-height: 100vh;
  padding: 20px;
`;

const StyledTaskMarketplace = styled.main`
  background-color: transparent;
  min-height: 100vh;
  padding: 40px 20px;
  font-family: Inter, system-ui, -apple-system, sans-serif;
  transition: all 0.3s ease;
  max-width: 1400px;
  margin: 0 auto;
`;

export default SkillSharePlatform;