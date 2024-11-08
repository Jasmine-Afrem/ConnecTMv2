'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import Header from './header';
import PromotionalPanel from './promotionalpanel';
import SearchSection from './searchsection';
import AvailableGigs from './availablegigs';
import ContactAndMapSection from './contactandmapsection';
import HelpPrompt from './prompt'; // Import the HelpPrompt component

interface User {
  email: string;
  id: string;
}

interface EventStats {
  activeUsers: number;
  totalEvents: number;
}

const SkillSharePlatform: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [skillPoints, setSkillPoints] = useState<number>(0);
  const [eventStats, setEventStats] = useState<EventStats>({ activeUsers: 0, totalEvents: 0 });
  const [location, setLocation] = useState<string>('');
  const [searchRadius, setSearchRadius] = useState<number>(10);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories'); // Ensure selectedCategory is set

  const createTask = (task: { title: string; description: string }) => {
    console.log("Creating task:", task);
    setSkillPoints(skillPoints + 10); // Increase skill points
  };

  const signIn = (email: string, password: string) => {
    console.log("Signing in with email:", email, "and password:", password);
    setUser({ email, id: "user-id" });
    setEventStats({ activeUsers: eventStats.activeUsers + 1, totalEvents: eventStats.totalEvents });
  };

  const signOut = () => {
    console.log("Signing out");
    setUser(null);
  };

  // Handler for "Create a Gig" button click
  const handleCreateGig = () => {
    console.log("Create a Gig clicked");
    // You can add additional logic here, like opening a modal or redirecting the user.
  };

  return (
    <StyledSkillSharePlatform>
      <StyledTaskMarketplace>
        <Header
          user={user}
          skillPoints={skillPoints}
          signIn={signIn}
          signOut={signOut}
        />
        <PromotionalPanel eventStats={eventStats} />
        {user && (
          <StyledButton onClick={() => createTask({ title: "New Task", description: "Description" })}>
            Post New Service
          </StyledButton>
        )}
        <SearchSection
          location={location}
          setLocation={setLocation}
          searchRadius={searchRadius}
          setSearchRadius={setSearchRadius}
          selectedCategory={selectedCategory} // Pass selectedCategory here
          setSelectedCategory={setSelectedCategory} // Pass setSelectedCategory here
        />

        {/* Use the HelpPrompt Component */}
        <HelpPrompt onCreateGig={handleCreateGig} />

        <AvailableGigs />
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
