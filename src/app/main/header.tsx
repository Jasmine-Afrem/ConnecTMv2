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
        <StyledLogo>LocalSkills</StyledLogo>
        <MobileMenuButton onClick={toggleMobileMenu} aria-label="Toggle mobile menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </MobileMenuButton>
        <StyledNav $showMobileMenu={showMobileMenu}>
          <NavButton aria-label="Toggle navigation menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </NavButton>
        </StyledNav>
      </LogoSection>
      {!user ? (
        <AuthSection>
          <NavLink href="/">Home</NavLink>
          <NavLink href="/about">About Us</NavLink>
          <SignInButton onClick={() => signIn("test@test.com", "password")}>
            Sign In
          </SignInButton>
        </AuthSection>
      ) : (
        <UserSection>
          <UserInfo>
            Welcome, {user.email}
            <SkillPoints>{skillPoints} SP</SkillPoints>
          </UserInfo>
          <SignOutButton onClick={signOut}>Sign Out</SignOutButton>
        </UserSection>
      )}
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
  align-items: center;
  gap: 40px;
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
    display: block;
  }
`;

const StyledNav = styled.nav<{ $showMobileMenu: boolean }>`
  display: flex;
  gap: 30px;
  @media (max-width: 640px) {
    display: ${props => props.$showMobileMenu ? 'flex' : 'none'};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    background-color: #333;
    padding: 20px;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.5);
    border-radius: 0 0 16px 16px;
  }
`;

const NavButton = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  background: #444;
  color: #f0f0f0;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const AuthSection = styled.div`
  display: flex;
  gap: 20px;
`;

const NavLink = styled.a`
  color: #f0f0f0;
  text-decoration: none;
  padding: 10px 20px;
  font-size: 18px;
  font-weight: 500;
  @media (max-width: 640px) {
    display: none;
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
  @media (max-width: 640px) {
    display: none;
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
