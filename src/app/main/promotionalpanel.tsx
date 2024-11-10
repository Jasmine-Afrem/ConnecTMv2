'use client'; 
import React from 'react';
import styled from 'styled-components';

interface EventStats {
  activeUsers: number;
  totalEvents: number;
}

interface PromotionalPanelProps {
  eventStats: EventStats;
}

const PromotionalPanel: React.FC<PromotionalPanelProps> = ({ eventStats }) => {
  return (
    <StyledPromotionalPanel>
      <ContentSection>
        <Title>Share Your Skills, Earn Rewards!</Title>
        <Description>
          Join our community of skilled individuals helping each other. Earn skill points for every service you provide and redeem them for other services!
        </Description>
        <StatsContainer>
          <StatItem>
            <StatValue>{eventStats.activeUsers}+</StatValue>
            <StatLabel>Active Users</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{eventStats.totalEvents}+</StatValue>
            <StatLabel>Services Completed</StatLabel>
          </StatItem>
        </StatsContainer>
      </ContentSection>
      <ImageSection>
        <StyledImage src="https://placehold.co/400x300" alt="Community helping each other" />
      </ImageSection>
    </StyledPromotionalPanel>
  );
};

const StyledPromotionalPanel = styled.section`
  background-color: rgba(15, 20, 84, 0.89); 
  padding: 30px;
  border-radius: 18px;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 40px;
  @media (max-width: 640px) {
    flex-direction: column;
    padding: 20px;
    text-align: center;
    gap: 20px;
  }
`;

const ContentSection = styled.div`
  flex: 1;
  @media (max-width: 640px) {
    order: 2;
  }
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #f3f4f6;  // Lighter color for text
  margin-bottom: 16px;
`;

const Description = styled.p`
  font-size: 16px;
  color: #e5e7eb;  // Light gray text
  line-height: 1.6;
  margin-bottom: 20px;
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 20px;
  @media (max-width: 640px) {
    justify-content: center;
  }
`;

const StatItem = styled.div`
  text-align: center;
  background-color: #dedede;  // Darker background for stat items
  padding: 12px 20px;
  border-radius: 18px;
  border-color: #293691;
  border: solid 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #293691;  // Lighter blue for the stats
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #293691;  // Light gray text for labels
`;

const ImageSection = styled.div`
  flex: 1;
  max-width: 400px;
  @media (max-width: 640px) {
    order: 1;
    max-width: 100%;
  }
`;

const StyledImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export default PromotionalPanel;
