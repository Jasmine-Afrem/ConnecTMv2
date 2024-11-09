'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import Header from './header';
import PromotionalPanel from './promotionalpanel';
import SearchSection from './searchsection';
import AvailableGigs from './availablegigs';
import ContactAndMapSection from './contactandmapsection';
import HelpPrompt from './prompt'; // Import the HelpPrompt component
import { useRouter } from 'next/navigation';

interface User {
  email: string;
  id: string;
  profilePicture?: string; // Optional profile picture URL
}

interface EventStats {
  activeUsers: number;
  totalEvents: number;
}

const SkillSharePlatform: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [eventStats, setEventStats] = useState<EventStats>({ activeUsers: 0, totalEvents: 0 });
  const [location, setLocation] = useState<string>('');
  const [searchRadius, setSearchRadius] = useState<number>(10);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const router = useRouter();

  // Memoize the checkAuth function to avoid unnecessary re-renders
  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/protected', {
        method: 'GET',
        credentials: 'include', // Include cookies for authentication
      });

      const text = await response.text();
      const data = JSON.parse(text);  // Manually parse the response

      if (response.ok && data.success) {
        setUser({ email: data.email, id: data.userId, profilePicture: data.profilePicture });
        setIsLoggedIn(true);
        updateEventStats(true);  // Update event stats when user is logged in
      } else {
        setIsLoggedIn(false);
        setUser(null);
        alert(data.message); // Show the error message if not logged in
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

  useEffect(() => {
    checkAuth();  // Check authentication when the component mounts
  }, [checkAuth]);  

  const updateEventStats = (isLoggedIn: boolean) => {
    setEventStats(prevStats => ({
      activeUsers: isLoggedIn ? prevStats.activeUsers + 1 : prevStats.activeUsers - 1,
      totalEvents: prevStats.totalEvents,
    }));
  };

  const signOut = () => {
    setUser(null);
    setIsLoggedIn(false);
    document.cookie = "token=; max-age=0; path=/"; // Clear the token cookie
    updateEventStats(false);  // Update event stats when logging out
    router.push('/main'); // Redirect to /main after logout
  };

  const signIn = () => {
    router.push('/login'); // Redirect to login page when Sign In button is clicked
  };

  return (
    <StyledSkillSharePlatform>
      <StyledTaskMarketplace>
        <Header
          user={user}
          signOut={signOut}
          signIn={signIn}
          eventStats={eventStats}
        />
        
        {!isLoggedIn && <PromotionalPanel eventStats={eventStats} />}
        
        {isLoggedIn && (
          <StyledButton onClick={() => console.log("Post New Service")}>
            Post New Service
          </StyledButton>
        )}

        {isLoggedIn && (
          <SearchSection
            location={location}
            setLocation={setLocation}
            searchRadius={searchRadius}
            setSearchRadius={setSearchRadius}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        )}
        
        {isLoggedIn && <AvailableGigs />}
        
        {!isLoggedIn && <HelpPrompt onCreateGig={signIn} />}
        
        <ContactAndMapSection />
      </StyledTaskMarketplace>
    </StyledSkillSharePlatform>
  );
};

const StyledSkillSharePlatform = styled.div`
  background-color: #424a59;
  min-height: 100vh;
  padding: 20px;
  @media (max-width: 640px) {
    padding: 10px;
    min-height: auto;
  }
`;

const StyledTaskMarketplace = styled.main`
  background-color: #424a59;
  min-height: 100vh;
  padding: 40px 20px;
  font-family: Inter, system-ui, -apple-system, sans-serif;
  transition: all 0.3s ease;
  max-width: 1400px;
  margin: 0 auto;
`;

const StyledButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: 500;
`;

export default SkillSharePlatform;
