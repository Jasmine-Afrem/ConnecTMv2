'use client';

import React, { useState } from 'react';
import styled from 'styled-components';

interface User {
  email: string;
}

interface HeaderProps {
  user: User | null;
  skillPoints: number;
  signIn: (email: string, password: string) => void;
  signOut: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, skillPoints, signIn, signOut }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <StyledHeader>
      <LogoSection>
        <StyledLogo>ConnecTM</StyledLogo>

        {/* Mobile Hamburger Button (only for small screens) */}
        <MobileMenuButton onClick={toggleMobileMenu} aria-label="Toggle mobile menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </MobileMenuButton>

        {/* Full NavBar for larger screens */}
        <StyledNav>
          <NavLink href="/">Home</NavLink>
          <NavLink href="/about">About Us</NavLink>
          <SignInButton onClick={() => signIn("test@test.com", "password")}>
            Sign In
          </SignInButton>
        </StyledNav>

        {/* Mobile Dropdown Menu */}
        {showMobileMenu && (
          <MobileDropdownMenu>
            <NavLink href="/">Home</NavLink>
            <NavLink href="/about">About Us</NavLink>
            <NavLink href="#" onClick={() => signIn("test@test.com", "password")}>
              Sign In
            </NavLink>
          </MobileDropdownMenu>
        )}
      </LogoSection>

      {/* Auth Section for when the user is logged in */}
      {user ? (
        <UserSection>
          <UserInfo>
            Welcome, {user.email}
            <SkillPoints>{skillPoints} SP</SkillPoints>
          </UserInfo>
          <SignOutButton onClick={signOut}>Sign Out</SignOutButton>
        </UserSection>
      ) : null}
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
  backdrop-filter: blur(10px);
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

const MobileMenuButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 10px;
  color: #f0f0f0;
  display: none;

  @media (max-width: 640px) {
    display: block; /* Show hamburger button on small screens */
  }
`;

const StyledNav = styled.nav`
  display: flex;
  gap: 30px;
  align-items: center;
  @media (max-width: 640px) {
    display: none; /* Hide nav links on small screens */
  }
`;

const MobileDropdownMenu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: absolute;
  top: 80px; /* Position the dropdown below the header */
  right: 30px;
  background-color: #333;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
  z-index: 20;

  a {
    color: #f0f0f0;
    text-decoration: none;
    font-size: 16px;
    font-weight: 500;
    padding: 10px;
    border-radius: 8px;

    &:hover {
      background-color: #444;
    }
  }
`;

const NavLink = styled.a`
  color: #f0f0f0;
  text-decoration: none;
  padding: 10px 20px;
  font-size: 18px;
  font-weight: 500;

  &:hover {
    background-color: #444;
    border-radius: 8px;
  }
`;

const SignInButton = styled.button`
  padding: 10px 20px;
  background-color: #0066cc;
  color: #f0f0f0;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  font-size: 18px;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    background-color: #2862bf;
    box-shadow: 0 6px 8px -2px rgba(59, 130, 246, 0.6), 0 4px 6px -1px rgba(59, 130, 246, 0.1);
  }

  @media (max-width: 640px) {
    display: none; /* Hide the button on mobile */
  }
`;

const UserSection = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #f0f0f0;
`;

const SkillPoints = styled.span`
  background-color: #28a745;
  color: #f0f0f0;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 14px;
`;

const SignOutButton = styled.button`
  padding: 10px 20px;
  background-color: #cc3333;
  color: #f0f0f0;
  border-radius: 20px;
  border: none;
  cursor: pointer;

  @media (max-width: 640px) {
    display: none;
  }
`;

export default Header;