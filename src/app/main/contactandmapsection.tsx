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
          <MapImage src="https://www.gmap.ro/MAPS/Google/base/roadmap/Timisoara_Centru.jpg" alt="Office Location Map" />
        </MapContainer>
      </ContactContent>
    </ContactSection>
  );
};

const ContactSection = styled.section`
  background-color: rgba(15, 20, 84, 1); 
  padding: 30px;
  border-radius: 18px;
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
  font-size: 26px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #fff; /* Light text for dark background */
`;

const AddressBlock = styled.div`
  margin-bottom: 20px;
`;

const BlockTitle = styled.h3`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 10px;
  color: #fff; /* Lighter gray text */
`;

const AddressText = styled.p`
  color: #fff; /* Soft gray text */
  line-height: 1.6;
  margin-left: 10px;
`;

const ContactBlock = styled.div`
  margin-bottom: 20px;
`;

const ContactText = styled.p`
  color: #fff; /* Soft gray text */
  line-height: 1.6;
  margin-left: 10px;
`;

const ContactButton = styled.button`
  background-color: #dedede; /* Blue button */
  color: #293691; /* Light text */
  padding: 12px 24px;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  &:hover {
    background-color: #dedede; /* Darker blue on hover */
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
  border: dotted 3px;
  border-radius: 16px;
  border-color: #fff;
`;

export default ContactAndMapSection;
