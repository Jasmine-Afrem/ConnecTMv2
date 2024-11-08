'use client';

import React from 'react';
import styled from 'styled-components';

const ContactAndMapSection: React.FC = () => {
  return (
    <ContactSection>
      <ContactContent>
        <ContactInfo>
          <SectionTitle>Contact Us</SectionTitle>
          <AddressBlock>
            <BlockTitle>Office Location</BlockTitle>
            <AddressText>
              123 Skill Share Street<br />
              Innovation District<br />
              Tech City, TC 12345
            </AddressText>
          </AddressBlock>
          <ContactBlock>
            <BlockTitle>Contact Information</BlockTitle>
            <ContactText>
              Email: support@localskills.com<br />
              Phone: (555) 123-4567<br />
              Hours: Mon-Fri, 9:00 AM - 6:00 PM
            </ContactText>
          </ContactBlock>
          <ContactButton>Send us a message</ContactButton>
        </ContactInfo>
        <MapContainer>
          <MapImage src="https://placehold.co/800x400" alt="Office Location Map" />
        </MapContainer>
      </ContactContent>
    </ContactSection>
  );
};

const ContactSection = styled.section`
  background-color: #1e293b; /* Dark background */
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  @media (max-width: 640px) {
    padding: 20px;
  }
`;

const ContactContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  @media (max-width: 991px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const ContactInfo = styled.div`
  padding: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #e5e7eb; /* Light text for dark background */
`;

const AddressBlock = styled.div`
  margin-bottom: 20px;
`;

const BlockTitle = styled.h3`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 10px;
  color: #cbd5e1; /* Lighter gray text */
`;

const AddressText = styled.p`
  color: #94a3b8; /* Soft gray text */
  line-height: 1.6;
`;

const ContactBlock = styled.div`
  margin-bottom: 20px;
`;

const ContactText = styled.p`
  color: #94a3b8; /* Soft gray text */
  line-height: 1.6;
`;

const ContactButton = styled.button`
  background-color: #3b82f6; /* Blue button */
  color: #f9fafb; /* Light text */
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  &:hover {
    background-color: #2563eb; /* Darker blue on hover */
  }
`;

const MapContainer = styled.div`
  border-radius: 12px;
  overflow: hidden;
  height: 400px;
  @media (max-width: 640px) {
    height: 300px;
  }
`;

const MapImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export default ContactAndMapSection;
