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

interface User {
  email: string;
  id: string;
  profilePicture?: string;
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

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const updateEventStats = (isLoggedIn: boolean) => {
    setEventStats(prevStats => ({
      activeUsers: isLoggedIn ? prevStats.activeUsers + 1 : prevStats.activeUsers - 1,
      totalEvents: prevStats.totalEvents,
    }));
  };

  const signOut = async () => {
    try {
      // Clear the cookie with explicit path and domain if necessary
      document.cookie = "token=; path=/; domain=" + window.location.hostname + "; max-age=0; SameSite=Strict; Secure";
      
      // Update state and stats
      setUser(null);
      setIsLoggedIn(false);
      updateEventStats(false);
  
      // Optionally, call a logout API endpoint to clear the session
      await fetch('/api/users/logout', { method: 'POST', credentials: 'include' });
      
      // Navigate to main page after sign-out
      router.push('/main');
    } catch (error) {
      console.error('Error during sign-out:', error);
    }
  };  

  const signIn = () => {
    router.push('/login');
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
        
        {/* Render HelpPrompt in all cases and pass isLoggedIn prop */}
        <HelpPrompt onCreateGig={isLoggedIn ? () => router.push('/gigform') : signIn} />

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

export default SkillSharePlatform;
