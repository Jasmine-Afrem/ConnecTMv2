'use client'; 
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import L from 'leaflet'; // Leaflet import

interface SearchSectionProps {
  location: string;
  setLocation: (location: string) => void;
  searchRadius: number;
  setSearchRadius: (radius: number) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({
  location,
  setLocation,
  searchRadius,
  setSearchRadius,
  selectedCategory,
  setSelectedCategory,
}) => {
  const categories = [
    'All Categories',
    'Health & Wellness',
    'Technology',
    'Education',
    'Entertainment',
    'Services',
  ]; // Example categories
  
  const [showMap, setShowMap] = useState(false); // Controls map visibility
  const [selectedLatLng, setSelectedLatLng] = useState<L.LatLng | null>(null);

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  };

  const openLocationMap = () => {
    setShowMap(true);
  };

  const closeLocationMap = () => {
    setShowMap(false);
  };

  const onMapClick = useCallback((e: L.LeafletMouseEvent) => {
    setSelectedLatLng(e.latlng);
    setLocation(`Lat: ${e.latlng.lat.toFixed(4)}, Lng: ${e.latlng.lng.toFixed(4)}`);
  }, [setLocation]);

  // Initialize Leaflet map when the component mounts
  useEffect(() => {
    if (typeof window !== "undefined" && showMap) {
      const map = L.map("map").setView([51.505, -0.09], 13); // Initialize the map with a default center and zoom

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
      }).addTo(map);

      map.on("click", onMapClick);

      return () => {
        map.remove();
      };
    }
  }, [showMap, onMapClick]);

  return (
    <SearchContainer>
      <SearchForm>
        <Headline>Find the perfect gig for you</Headline>
        <LocationContainer>
          <LocationInput
            type="text"
            placeholder="Enter your location..."
            value={location}
            onChange={handleLocationChange}
            aria-label="Enter your location"
          />
          <LocationButton onClick={openLocationMap} aria-label="Pick location on map">
            📍
          </LocationButton>
        </LocationContainer>

        {/* Location Map Popup */}
        {showMap && (
          <LocationMapContainer>
            <button onClick={closeLocationMap}>Close Map</button>
            <div id="map" style={{ height: '400px', width: '100%' }} />
            {selectedLatLng && (
              <p>Selected Location: Lat: {selectedLatLng.lat.toFixed(4)}, Lng: {selectedLatLng.lng.toFixed(4)}</p>
            )}
          </LocationMapContainer>
        )}

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
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </CategorySelect>
      </SearchForm>
    </SearchContainer>
  );
};
// Styled components 

const Headline = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  color: #f9fafb;
  text-align: center;
  margin-bottom: 20px;
  
  @media (max-width: 640px) {
    font-size: 1.5rem;
  }
`;


const SearchContainer = styled.section`
  background-color: #1e293b;
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

const LocationContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
`;

const LocationInput = styled.input`
  padding: 15px 20px;
  border-radius: 15px;
  border: 1px solid #374151;
  background-color: #374151;
  color: #f9fafb;
  width: 90%;
  font-size: 18px;
  transition: all 0.2s ease;

  &::placeholder {
    color: #94a3b8;
  }

  @media (max-width: 640px) {
    font-size: 16px;
    padding: 12px 15px;
  }
`;

const LocationButton = styled.button`
  padding: 10px;
  border-radius: 50%;
  background-color: #374151;
  color: #f9fafb;
  border: none;
  cursor: pointer;
  font-size: 18px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #3b454e;
  }
`;

const LocationMapContainer = styled.div`
  margin-top: 20px;
  width: 100%;
  max-width: 600px;
  padding: 10px;
  background-color: #2d3c4e;
  border-radius: 10px;

  button {
    padding: 10px;
    background-color: #374151;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  #map {
    margin-top: 10px;
  }
`;

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
  background-color: #374151;
`;

const RadiusLabel = styled.span`
  min-width: 60px;
  color: #94a3b8;
  font-size: 14px;
`;

const CategorySelect = styled.select`
  padding: 15px 20px;
  border-radius: 15px;
  border: 1px solid #374151;
  background-color: #374151;
  color: #f9fafb;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;

  &::placeholder {
    color: #94a3b8;
  }

  @media (max-width: 640px) {
    font-size: 16px;
    padding: 12px 15px;
  }
`;

export default SearchSection;
