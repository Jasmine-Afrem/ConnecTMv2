'use client'; 
import React from 'react';
import styled from 'styled-components';

interface SearchSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  location: string;
  setLocation: (location: string) => void;
  searchRadius: number;
  setSearchRadius: (radius: number) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
}

const SearchSection: React.FC<SearchSectionProps> = ({
  searchQuery,
  setSearchQuery,
  location,
  setLocation,
  searchRadius,
  setSearchRadius,
  selectedCategory,
  setSelectedCategory,
  categories,
}) => {
  return (
    <SearchContainer>
      <SearchForm>
        <SearchInput
          type="text"
          placeholder="Search services..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search services"
        />
        <LocationInput
          type="text"
          placeholder="Enter your location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          aria-label="Enter your location"
        />
        <RadiusContainer>
          <RadiusInput
            type="range"
            min="1"
            max="50"
            value={searchRadius}
            onChange={(e) => setSearchRadius(parseInt(e.target.value))}
            aria-label="Search radius"
          />
          <RadiusLabel>{searchRadius} miles</RadiusLabel>
        </RadiusContainer>
        <CategorySelect
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          aria-label="Select category"
        >
          <option value="All">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </CategorySelect>
      </SearchForm>
      <CategoryTags>
        {categories.map((cat) => (
          <CategoryTag
            key={cat}
            $isSelected={selectedCategory === cat}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </CategoryTag>
        ))}
      </CategoryTags>
    </SearchContainer>
  );
};

const SearchContainer = styled.section`
  background-color: #1e293b; /* Dark background */
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  @media (max-width: 640px) {
    padding: 15px;
  }
`;

const SearchForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  margin-bottom: 20px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto 20px auto;
`;

const SearchInput = styled.input`
  padding: 15px 20px;
  border-radius: 15px;
  border: 1px solid #374151; /* Dark border */
  background-color: #374151; /* Dark input background */
  color: #f9fafb; /* Light text color */
  width: 100%;
  font-size: 18px;
  transition: all 0.2s ease;

  &::placeholder {
    color: #94a3b8; /* Light gray placeholder text */
  }

  @media (max-width: 640px) {
    font-size: 16px;
    padding: 12px 15px;
  }
`;

const LocationInput = styled(SearchInput)``;

const RadiusContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
`;

const RadiusInput = styled.input`
  width: 100%;
  height: 8px;
  border-radius: 4px;
  appearance: none;
  background-color: #374151; /* Dark slider background */
`;

const RadiusLabel = styled.span`
  min-width: 60px;
  color: #94a3b8; /* Light gray label */
  font-size: 14px;
`;

const CategorySelect = styled.select`
  padding: 15px 20px;
  border-radius: 15px;
  border: 1px solid #374151; /* Dark border */
  background-color: #374151; /* Dark select background */
  color: #f9fafb; /* Light text color */
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  
  &::placeholder {
    color: #94a3b8; /* Light gray placeholder text */
  }

  @media (max-width: 640px) {
    font-size: 16px;
    padding: 12px 15px;
  }
`;

const CategoryTags = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 100%;
  @media (max-width: 640px) {
    gap: 8px;
  }
`;

const CategoryTag = styled.button<{ $isSelected: boolean }>`
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${(props) => (props.$isSelected ? "#3b82f6" : "#374151")}; /* Dark background for unselected */
  color: ${(props) => (props.$isSelected ? "white" : "#94a3b8")}; /* Light text for selected, gray for unselected */
  border: none;
  font-size: 14px;
  font-weight: 500;

  &:hover {
    background-color: ${(props) => (props.$isSelected ? "#2563eb" : "#3b82f6")}; /* Blue on hover for unselected */
  }
`;

export default SearchSection;
