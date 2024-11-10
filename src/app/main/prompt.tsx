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
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
  background-color: rgba(15, 20, 84, 0.89); 
  padding: 20px;
  border-radius: 18px;
  width: 100%;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    padding: 15px;
  }
`;

const StyledHelpText = styled.p`
  font-size: 24px;
  font-weight: 600;
  padding-left: 2px;
  margin: 0;
  color: #f9fafb;
  flex-grow: 1;
  text-align: left;
  line-height: 1.4;
  
  @media (max-width: 768px) {
    font-size: 20px;
    text-align: center;
    margin-bottom: 10px;
  }

  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const StyledButton = styled.button`
  padding: 12px 25px;
  background-color: #dedede;
  color: #293691;
  border-radius: 20px;
  border-color: #63b3ed;
  border: solid 1px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:not(:disabled):hover {
    transform: translateY(-2px);
    background-color: #dedede;
    box-shadow: 0 6px 8px -2px rgba(59, 130, 246, 0.6), 0 4px 6px -1px rgba(59, 130, 246, 0.1);
  }

  @media (max-width: 768px) {
    font-size: 16px;
    padding: 10px 20px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
    padding: 8px 15px;
  }
`;

export default HelpPrompt;
