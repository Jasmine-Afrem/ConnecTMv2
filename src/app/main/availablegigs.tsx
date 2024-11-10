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
  problemOwner: string; // Added the owner of the problem
}

const AvailableGigs: React.FC = () => {
  const [gigs] = useState<Gig[]>([
    {
      id: '1',
      title: 'Solve Math Problem for High School',
      category: 'Math',
      description: 'A student needs help solving complex calculus problems for an upcoming exam.',
      skillPoints: 200,
      duration: '2 hours ago',
      imageUrl: 'https://t4.ftcdn.net/jpg/04/99/93/31/360_F_499933117_ZAUBfv3P1HEOsZDrnkbNCt4jc3AodArl.jpg',
      problemOwner: 'John Doe',
    },
    {
      id: '2',
      title: 'Design Logo for Startup',
      category: 'Design',
      description: 'A new startup needs a creative and modern logo to establish its brand identity.',
      skillPoints: 300,
      duration: '5 hours ago',
      imageUrl: 'https://t4.ftcdn.net/jpg/04/99/93/31/360_F_499933117_ZAUBfv3P1HEOsZDrnkbNCt4jc3AodArl.jpg',
      problemOwner: 'Jane Smith',
    },
    {
      id: '3',
      title: 'Build a Personal Website',
      category: 'Development',
      description: 'A professional needs a responsive and modern website to showcase their portfolio.',
      skillPoints: 500,
      duration: '10 hours ago',
      imageUrl: 'https://t4.ftcdn.net/jpg/04/99/93/31/360_F_499933117_ZAUBfv3P1HEOsZDrnkbNCt4jc3AodArl.jpg',
      problemOwner: 'Alex Johnson',
    },
    {
      id: '4',
      title: 'Create a Marketing Strategy for Small Business',
      category: 'Marketing',
      description: 'A small business needs an online marketing strategy to boost its sales and visibility.',
      skillPoints: 150,
      duration: '4 hours ago',
      imageUrl: 'https://t4.ftcdn.net/jpg/04/99/93/31/360_F_499933117_ZAUBfv3P1HEOsZDrnkbNCt4jc3AodArl.jpg',
      problemOwner: 'Emily Davis',
    },
    {
      id: '5',
      title: 'Photography for Product Launch',
      category: 'Photography',
      description: 'A company needs professional photography for an upcoming product launch.',
      skillPoints: 250,
      duration: '3 hours ago',
      imageUrl: 'https://t4.ftcdn.net/jpg/04/99/93/31/360_F_499933117_ZAUBfv3P1HEOsZDrnkbNCt4jc3AodArl.jpg',
      problemOwner: 'Chris Lee',
    },
    // Add more gigs here if needed...
  ]);

  const [showAllGigs, setShowAllGigs] = useState(false);

  const toggleMoreGigs = () => {
    setShowAllGigs(!showAllGigs);
  };

  const displayedGigs = showAllGigs ? gigs : gigs.slice(0, 3);

  const handleApplyClick = (gigId: string) => {
    alert(`You have applied for gig: ${gigId}`);
    // Implement actual application logic here (e.g., sending a request to the backend)
  };

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
