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

const Header: React.FC<HeaderProps & { userId: string }> = ({ user, signIn, signOut, eventStats, userId }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const router = useRouter();
  const [points, setPoints] = useState<number | null>(null);

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const goToProfile = () => {
    router.push('/profile');
  };

  const goToFunds = () => {
    router.push('/funds');
  };

  const logout = () => {
    signOut();
    setShowProfileMenu(false);
  };

  return (
    <StyledHeader>
      <LogoSection>
        <StyledLogo onClick={() => router.push('/main')}>ConnecTM</StyledLogo>
      </LogoSection>

      <UserSection>
        {user && (
          <>
            <SkillPointsBox>
              Skill Points: {points}
            </SkillPointsBox>

            <ProfileButton onClick={toggleProfileMenu}>
              <ProfileImage
                src={user.profilePicture || 'https://png.pngitem.com/pimgs/s/508-5087146_circle-hd-png-download.png'}
                alt="Profile"
              />
            </ProfileButton>

            {showProfileMenu && (
              <ProfileMenu>
                <MenuItem>{user.email}</MenuItem>
                <MenuItem> Skill Points: {points || eventStats.activeUsers}</MenuItem>
                <MenuItem onClick={goToProfile}>View Profile</MenuItem>
                <MenuItem onClick={goToFunds}>View Funds</MenuItem>
                <MenuItem onClick={logout}>Log Out</MenuItem>
              </ProfileMenu>
            )}
          </>
        )}

        {!user ? (
          <SignInButton onClick={signIn}>Sign In</SignInButton>
        ) : null}
      </UserSection>
    </StyledHeader>
  );
};

const StyledHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  background-color: #0f1454;
  border-radius: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.5);
  margin-bottom: 30px;
  position: sticky;
  top: 20px;
  z-index: 10;

  @media (max-width: 768px) {
    padding: 15px 20px;
  }
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
  cursor: pointer;
  transition: color 0.3s ease, text-shadow 0.3s ease;

  &:hover {
    color: #dcdcdc;
    text-shadow: 0 2px 6px rgba(255, 255, 255, 0.5);
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const SkillPointsBox = styled.div`
  background-color: #31377a;
  color: #fff;
  padding: 10px 12px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  margin-right: 15px;
  display: flex;
  align-items: center;
  white-space: nowrap;

  @media (max-width: 768px) {
    display: none;
  }
`;

const SignInButton = styled.button`
  padding: 10px 25px;
  background-color: #dedede;
  color: #293691;
  border-radius: 30px;
  border: solid 1px #293691;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:not(:disabled):hover {
    transform: translateY(-2px);
    background-color: #b5b5b5;
    box-shadow: 0 6px 8px -2px rgba(0, 102, 204, 0.6), 0 4px 6px -1px rgba(0, 102, 204, 0.1);
  }
`;

const ProfileButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 10px;
  margin-left: 15px;
`;

const ProfileImage = styled.img`
  border-radius: 50%;
  width: 112px;
  height: 60px;
  object-fit: cover;
  flex-shrink: 0;
`;

const ProfileMenu = styled.div`
  background-color: #0f1454;
  padding: 15px;
  position: absolute;
  right: 20px;
  top: 70px;
  border-radius: 18px;
  border: solid 4px #2e348f;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 100;
`;

const MenuItem = styled.div`
  color: white;
  padding: 12px 15px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #1c2273;
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    text-shadow: 0 2px 4px #a6a2a2;
  }
`;

export default Header;
