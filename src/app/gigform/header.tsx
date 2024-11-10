'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';

interface User {
  email: string;
  id: string;
  profilePicture?: string;
}

interface HeaderProps {
  user: User | null;
  skillPoints: number;
  signIn: (email: string, password: string) => void;
  signOut: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, skillPoints, signIn, signOut }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const router = useRouter();

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
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
        <StyledLogo>ConnecTM</StyledLogo>

        <MobileMenuButton onClick={toggleMobileMenu} aria-label="Toggle mobile menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </MobileMenuButton>

        {/* Conditional rendering instead of using the 'show' prop */}
        {showMobileMenu && (
          <StyledNav>
            <NavLink href="/">Home</NavLink>
            <NavLink href="/about">About Us</NavLink>
            <NavLink href="/contact">Contact</NavLink>
          </StyledNav>
        )}
      </LogoSection>

      <UserSection>
        {user ? (
          <>
            <SkillPointsBox>Skill Points: {skillPoints}</SkillPointsBox>
            <ProfileButton onClick={toggleProfileMenu}>
              <ProfileImage src={user.profilePicture || 'https://via.placeholder.com/40'} alt="Profile" />
            </ProfileButton>

            {showProfileMenu && (
              <ProfileMenu>
                <MenuItem>{user.email}</MenuItem>
                <MenuItem onClick={goToProfile}>View Profile</MenuItem>
                <MenuItem onClick={goToFunds}>View Funds</MenuItem>
                <MenuItem onClick={logout}>Log Out</MenuItem>
              </ProfileMenu>
            )}
          </>
        ) : (
          <SignInButton onClick={() => signIn("test@test.com", "password")}>Sign In</SignInButton>
        )}
      </UserSection>
    </StyledHeader>
  );
};

// Styled components
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
  align-items: center;
  width: 100%;
`;

const StyledLogo = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: #f0f0f0;
`;

const MobileMenuButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: #f0f0f0;
  display: none;

  @media (max-width: 640px) {
    display: block;
  }
`;

const StyledNav = styled.nav`
  display: flex;
  gap: 20px;
  align-items: center;

  @media (max-width: 640px) {
    flex-direction: column;
    position: absolute;
    top: 70px;
    right: 20px;
    background-color: #333;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
  }
`;

const NavLink = styled.a`
  color: #f0f0f0;
  text-decoration: none;
  padding: 10px;
  font-size: 16px;

  &:hover {
    background-color: #444;
    border-radius: 8px;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
`;

const SkillPointsBox = styled.div`
  background-color: #333;
  color: #f0f0f0;
  padding: 10px;
  border-radius: 12px;
  font-size: 14px;
  margin-right: 15px;
`;

const SignInButton = styled.button`
  padding: 10px 20px;
  background-color: #0066cc;
  color: #f0f0f0;
  border-radius: 20px;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #005bb5;
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
`;

const ProfileMenu = styled.div`
  background-color: #333;
  position: absolute;
  top: 70px;
  right: 30px;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  padding: 10px;
`;

const MenuItem = styled.div`
  color: #f0f0f0;
  padding: 10px;
  cursor: pointer;

  &:hover {
    background-color: #444;
  }
`;

export default Header;
