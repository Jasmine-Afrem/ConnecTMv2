'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';

interface User {
  email: string;
  id: string;
  profilePicture?: string;
}

interface EventStats {
  activeUsers: number;
  totalEvents: number;
}

interface HeaderProps {
  user: User | null;
  signIn: () => void;
  signOut: () => void;
  eventStats: EventStats;
}

const Header: React.FC<HeaderProps> = ({ user, signIn, signOut, eventStats }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const router = useRouter();

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const goToProfile = () => {
    router.push('/profile');
  };

  const logout = () => {
    signOut();
    setShowProfileMenu(false);
  };

  return (
    <StyledHeader>
      <LogoSection>
        <StyledLogo>ConnecTM</StyledLogo>
      </LogoSection>

      <UserSection>
        {/* Show Sign In button if user is not logged in */}
        {!user ? (
          <SignInButton onClick={signIn}>Sign In</SignInButton>
        ) : (
          <>
            {/* Profile Button if user is logged in */}
            <ProfileButton onClick={toggleProfileMenu}>
              <ProfileImage
                src={user.profilePicture || 'https://via.placeholder.com/40'}
                alt="Profile"
              />
            </ProfileButton>

            {showProfileMenu && (
              <ProfileMenu>
                <MenuItem>{user.email}</MenuItem>
                <MenuItem>Skill Points: {eventStats.activeUsers}</MenuItem>
                <MenuItem onClick={goToProfile}>View Profile</MenuItem>
                <MenuItem onClick={logout}>Log Out</MenuItem>
              </ProfileMenu>
            )}
          </>
        )}
      </UserSection>
    </StyledHeader>
  );
};

const StyledHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  background-color: #1a1a1a;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.5);
  margin-bottom: 30px;
  position: sticky;
  top: 20px;
  z-index: 10;
`;

const LogoSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const StyledLogo = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: #f0f0f0;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
`;

const SignInButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

const ProfileButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 10px;
`;

const ProfileImage = styled.img`
  border-radius: 50%;
  width: 40px;
  height: 40px;
  object-fit: cover;
`;

const ProfileMenu = styled.div`
  background-color: #333;
  padding: 10px;
  position: absolute;
  right: 20px;
  top: 60px;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
  z-index: 100;
`;

const MenuItem = styled.div`
  color: white;
  padding: 8px 10px;
  cursor: pointer;

  &:hover {
    background-color: #444;
  }
`;

export default Header;
