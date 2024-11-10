'use client';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface Gig {
  id: string;
  title: string;
  category: string;
  description: string;
  skillPoints: number;
  duration: string;
  imageUrl: string;
  problemOwner: string;
}

const categoryImageMap: Record<string, string> = {
  'Web Development': 'https://cdn-icons-png.flaticon.com/512/11485/11485970.png',
  'Health & Wellness': 'https://cdn-icons-png.flaticon.com/512/2966/2966327.png',
  'Technology': 'https://png.pngtree.com/png-vector/20230316/ourmid/pngtree-coding-line-icon-vector-png-image_6652750.png',
  'Education': 'https://cdn-icons-png.flaticon.com/512/3778/3778120.png',
  'Entertainment': 'https://cdn-icons-png.freepik.com/256/16494/16494990.png',
  'Services': 'https://cdn-icons-png.flaticon.com/512/4269/4269480.png',
};

interface AvailableGigsProps {
  gigs: Gig[];
  userId: string;
}

const AvailableGigs: React.FC<AvailableGigsProps> = ({ gigs, userId }) => {
  const [showAllGigs, setShowAllGigs] = useState(false);
  const [loading, setLoading] = useState(false); // Track loading state

  const toggleMoreGigs = () => {
    setShowAllGigs(!showAllGigs);
  };

  const displayedGigs = showAllGigs ? gigs : gigs.slice(0, 3);

  const handleApplyClick = async (gigId: string) => {
    if (!userId) {
      alert('Please log in to apply for gigs');
      return;
    }

    try {
      setLoading(true); // Start loading
      const response = await fetch('/api/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gigId,
          userId,
        }),
      });

      if (response.ok) {
        alert('You have successfully applied for this gig!');
      } else {
        alert('Failed to apply for the gig. Please try again.');
      }
    } catch (error) {
      console.error('Error applying for gig:', error);
      alert('An error occurred while applying for the gig.');
    } finally {
      setLoading(false); // End loading
    }
  };

  if (loading) {
    return <p>Loading...</p>; // Show loading text until the application request is complete
  }

  return (
    <GigsSection>
      <SectionTitle>Available Gigs</SectionTitle>
      <GigsGrid>
        {displayedGigs.map((gig) => (
          <GigCard key={gig.id}>
            <GigImage
              src={categoryImageMap[gig.category] || 'https://via.placeholder.com/400x200.png?text=No+Image'}
              alt={gig.category}
            />
            <GigContent>
              <GigCategory>{gig.category}</GigCategory>
              <GigTitle>{gig.title}</GigTitle>
              <GigDescription>{gig.description}</GigDescription>
              <GigDetails>
                <GigSkillPoints>{gig.skillPoints} SP</GigSkillPoints>
                <GigDuration>{gig.duration}</GigDuration>
              </GigDetails>
              <GigOwner>
                Problem posted by: <strong>{gig.problemOwner}</strong>
              </GigOwner>
              <ApplyButton onClick={() => handleApplyClick(gig.id)}>
                Apply for this gig
              </ApplyButton>
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
  background-color: rgba(15, 20, 84, 0.89);
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
  background-color: #383d70;
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
  width: 100%;
  height: 200px;
  object-fit: cover;
  margin: 0 auto;
`;

const GigContent = styled.div`
  padding: 20px;
`;

const GigCategory = styled.span`
  background-color: #dedede;
  color: #293691;
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
  -webkit-line-clamp: 3; /* Limit the description to 3 lines */
`;

const GigDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #6b7280;
  padding-top: 16px;
`;

const GigSkillPoints = styled.span`
  color: #8d97fc;
  font-weight: 500;
`;

const GigDuration = styled.span`
  color: #d1d5db;
  font-size: 14px;
`;

const GigOwner = styled.div`
  margin-top: 12px;
  font-size: 14px;
  color: #d1d5db;
`;

const ApplyButton = styled.button`
  padding: 10px 20px;
  background-color: #dedede;
  color: #293691;
  border-radius: 8px;
  border: solid 2px;
  border-color: #293691;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  margin-top: 12px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #b5b5b5;
  }
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
  background-color: #dedede;
  color: #293691;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  &:hover {
    background-color: #b5b5b5;
  }
`;

export default AvailableGigs;
