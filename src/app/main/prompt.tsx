'use client';

import React from 'react';
import styled from 'styled-components';

interface HelpPromptProps {
  onCreateGig: () => void;
}

const HelpPrompt: React.FC<HelpPromptProps> = ({ onCreateGig }) => {
  return (
    <StyledHelpSection>
      <StyledHelpText>Do you need help?</StyledHelpText>
      <StyledButton onClick={onCreateGig}>Create a Gig</StyledButton>
    </StyledHelpSection>
  );
};

const StyledHelpSection = styled.div`
  display: flex;
  flex-wrap: wrap; /* Allows elements to wrap on smaller screens */
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
  background-color: #1e293b; 
  padding: 20px;
  border-radius: 8px;
  width: 100%; /* Ensure full width */
  
  @media (max-width: 768px) {
    flex-direction: column; /* Stack elements vertically on medium and small screens */
    text-align: center; /* Center align text and button on smaller screens */
    padding: 15px; /* Reduced padding for smaller screens */
  }
`;

const StyledHelpText = styled.p`
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  color: #f9fafb;
  flex-grow: 1; /* Allow the text to take available space */
  text-align: left; /* Align the text to the left */
  line-height: 1.4; /* Make text more readable */
  
  @media (max-width: 768px) {
    font-size: 20px; /* Reduce font size for medium screens */
    text-align: center; /* Center the text on smaller screens */
    margin-bottom: 10px; /* Reduce margin between text and button */
  }

  @media (max-width: 480px) {
    font-size: 18px; /* Further reduce font size for small screens */
  }
`;

const StyledButton = styled.button`
  padding: 12px 25px;
  background-color: #0066cc; /* Matches SignInButton */
  color: #f0f0f0; /* Matches SignInButton */
  border-radius: 20px;
  border: none;
  cursor: pointer;
  font-size: 18px; /* Matches SignInButton */
  font-weight: 500;
  transition: all 0.3s ease; /* Smooth transition for hover effects */
  
  &:not(:disabled):hover {
    transform: translateY(-2px); /* Lift the button on hover */
    background-color: #2862bf; /* Change background color on hover */
    box-shadow: 0 6px 8px -2px rgba(59, 130, 246, 0.6), 0 4px 6px -1px rgba(59, 130, 246, 0.1); /* Add shadow on hover */
  }

  @media (max-width: 768px) {
    font-size: 16px; /* Reduce font size on smaller screens */
    padding: 10px 20px; /* Reduce padding for smaller screens */
  }

  @media (max-width: 480px) {
    font-size: 14px; /* Further reduce font size on very small screens */
    padding: 8px 15px; /* Further reduce padding on very small screens */
  }
`;

export default HelpPrompt;
