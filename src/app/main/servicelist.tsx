'use client'; 
import React, { useState } from 'react';
import styled from 'styled-components';

interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'open' | 'claimed' | 'completed' | 'in progress';
  skillPointsReward: number;
  estimatedDuration: string;
  createdBy: string;
  claimedBy?: string;
}

interface User {
  id: string;
  email: string;
}

interface ServiceListProps {
  user: User | null;
}

const ServiceList: React.FC<ServiceListProps> = ({ user }) => {
  const [services] = useState<Service[]>([
    {
      id: '1',
      title: 'Web Design Help',
      description: 'Need assistance with responsive design',
      category: 'Web Development',
      status: 'open',
      skillPointsReward: 150,
      estimatedDuration: '3 hours',
      createdBy: 'user2',
    },
    {
      id: '2',
      title: 'Data Analysis for Research Project',
      description: 'Seeking help with data visualization and analysis in Python',
      category: 'Data Science',
      status: 'open',
      skillPointsReward: 200,
      estimatedDuration: '5 hours',
      createdBy: 'user3',
    },
    {
      id: '3',
      title: 'Content Creation for Social Media',
      description: 'Looking for creative assistance with social media posts',
      category: 'Marketing',
      status: 'in progress',
      skillPointsReward: 100,
      estimatedDuration: '2 hours',
      createdBy: 'user4',
    },
    {
      id: '4',
      title: 'Database Optimization',
      description: 'Need help optimizing database queries for faster performance',
      category: 'Database Management',
      status: 'open',
      skillPointsReward: 250,
      estimatedDuration: '4 hours',
      createdBy: 'user5',
    },
    {
      id: '5',
      title: 'UI/UX Feedback on Mobile App',
      description: 'Looking for feedback on user experience for a mobile app prototype',
      category: 'UI/UX Design',
      status: 'completed',
      skillPointsReward: 120,
      estimatedDuration: '1 hour',
      createdBy: 'user6',
    },
  ]);

  const [showAll, setShowAll] = useState(false);

  const displayedServices = showAll ? services : services.slice(0, 3);

  const claimService = (serviceId: string) => {
    console.log(`Service ${serviceId} claimed`);
  };

  const completeService = (serviceId: string) => {
    console.log(`Service ${serviceId} completed`);
  };

  return (
    <ServiceListContainer>
      <ServiceGrid>
        {displayedServices.map((service) => (
          <ServiceCard key={service.id}>
            <ServiceHeader>
              <ServiceCategory>{service.category}</ServiceCategory>
              <ServiceDuration>{service.estimatedDuration}</ServiceDuration>
            </ServiceHeader>
            <ServiceTitle>{service.title}</ServiceTitle>
            <ServiceDescription>{service.description}</ServiceDescription>
            <ServiceFooter>
              <ServiceStatus $status={service.status}>
                {service.status}
              </ServiceStatus>
              <ServiceReward>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                {service.skillPointsReward} SP
              </ServiceReward>
            </ServiceFooter>
            {user && service.status === 'open' && service.createdBy !== user.id && (
              <ActionButton onClick={() => claimService(service.id)}>
                Claim Service
              </ActionButton>
            )}
            {user && service.status === 'claimed' && service.claimedBy === user.id && (
              <ActionButton onClick={() => completeService(service.id)}>
                Mark as Completed
              </ActionButton>
            )}
          </ServiceCard>
        ))}
      </ServiceGrid>
      {services.length > 3 && (
        <ShowMoreButton onClick={() => setShowAll(!showAll)}>
          {showAll ? 'Show Less' : 'Show More'}
        </ShowMoreButton>
      )}
    </ServiceListContainer>
  );
};

const ServiceListContainer = styled.section`
  margin-top: 40px;
  background-color: #111827;
  padding: 20px;
  border-radius: 12px;
`;

const ServiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  padding: 10px;
`;

const ServiceCard = styled.article`
  background-color: #1f2937;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
  }
`;

const ServiceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const ServiceCategory = styled.span`
  background-color: #374151;
  color: #9ca3af;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 14px;
`;

const ServiceDuration = styled.span`
  background-color: #374151;
  color: #9ca3af;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 14px;
`;

const ServiceTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #f9fafb;
`;

const ServiceDescription = styled.p`
  color: #d1d5db;
  margin-bottom: 16px;
  line-height: 1.5;
`;

const ServiceFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ServiceStatus = styled.span<{ $status: 'open' | 'claimed' | 'completed' | 'in progress' }>`
  color: white;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  background-color: ${({ $status }) => {
    switch ($status) {
      case 'open':
        return '#22c55e';
      case 'claimed':
        return '#eab308';
      case 'completed':
        return '#3b82f6';
      default:
        return '#94a3b8';
    }
  }};
`;

const ServiceReward = styled.span`
  background-color: #3b82f6;
  color: white;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #3b82f6;
  color: white;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.2s ease;
  border: none;

  &:hover {
    background-color: #2563eb;
  }
`;

const ShowMoreButton = styled.button`
  margin-top: 20px;
  padding: 12px;
  background-color: #1f2937;
  color: #f9fafb;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.2s ease;
  border: none;

  &:hover {
    background-color: #374151;
  }
`;

export default ServiceList;
