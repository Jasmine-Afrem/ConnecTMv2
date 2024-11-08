'use client'; 
import React, { useState } from 'react';
import styled from 'styled-components';

interface Gig {
  id: string;
  title: string;
  category: string;
  description: string;
  skillPoints: number;
  duration: string;
  imageUrl: string;
}

const AvailableGigs: React.FC = () => {
  const [gigs] = useState<Gig[]>([
    {
      id: '1',
      title: 'Math Tutoring',
      category: 'Tutoring',
      description: 'Expert math tutoring for all levels',
      skillPoints: 200,
      duration: '2 hours',
      imageUrl: 'https://placehold.co/300x200',
    },
    // Add more gigs here...
  ]);

  const [showAllGigs, setShowAllGigs] = useState(false);

  const toggleMoreGigs = () => {
    setShowAllGigs(!showAllGigs);
  };

  const displayedGigs = showAllGigs ? gigs : gigs.slice(0, 3);

  return (
    <GigsSection>
      <SectionTitle>Available Gigs</SectionTitle>
      <GigsGrid>
        {displayedGigs.map((gig) => (
          <GigCard key={gig.id}>
            <GigImage src={gig.imageUrl} alt={gig.title} />
            <GigContent>
              <GigCategory>{gig.category}</GigCategory>
              <GigTitle>{gig.title}</GigTitle>
              <GigDescription>{gig.description}</GigDescription>
              <GigDetails>
                <GigSkillPoints>{gig.skillPoints} SP</GigSkillPoints>
                <GigDuration>{gig.duration}</GigDuration>
              </GigDetails>
            </GigContent>
          </GigCard>
        ))}
      </GigsGrid>
      <ToggleButtonContainer>
        <ToggleButton onClick={toggleMoreGigs}>
          {showAllGigs ? 'View Less' : 'View More'}
        </ToggleButton>
      </ToggleButtonContainer>
    </GigsSection>
  );
};

const GigsSection = styled.section`
  background-color: #1f2937;
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  @media (max-width: 640px) {
    padding: 20px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #f9fafb;
`;

const GigsGrid = styled.div`
  display: grid;
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

const GigCard = styled.article`
  background-color: #374151;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const GigImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const GigContent = styled.div`
  padding: 20px;
`;

const GigCategory = styled.span`
  background-color: #4b5563;
  color: #e5e7eb;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 14px;
`;

const GigTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 12px 0;
  color: #f9fafb;
`;

const GigDescription = styled.p`
  color: #d1d5db;
  font-size: 14px;
  margin-bottom: 16px;
`;

const GigDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #6b7280;
  padding-top: 16px;
`;

const GigSkillPoints = styled.span`
  color: #60a5fa;
  font-weight: 500;
`;

const GigDuration = styled.span`
  color: #d1d5db;
  font-size: 14px;
`;

const ToggleButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
  @media (max-width: 640px) {
    margin-top: 20px;
  }
`;

const ToggleButton = styled.button`
  padding: 12px 24px;
  background-color: #3b82f6;
  color: #f9fafb;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  &:hover {
    background-color: #2563eb;
  }
`;

export default AvailableGigs;
