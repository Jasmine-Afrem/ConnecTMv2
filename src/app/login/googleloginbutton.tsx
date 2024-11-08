'use client';

import React from 'react';
import styled from 'styled-components';

export const GoogleLoginButton: React.FC = () => {
  return (
    <StyledGoogleLogin>
      <GoogleIcon width="24" height="24" viewBox="0 0 24 24">
        <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z" />
        <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z" />
        <path fill="#4A90E2" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z" />
        <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z" />
      </GoogleIcon>
      <span>Sign in with Google</span>
    </StyledGoogleLogin>
  );
};

const StyledGoogleLogin = styled.button`
  flex: 0 1 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 36px;
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 40px;
  color: black;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: auto;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  margin: 0 auto;
  font-weight: 600;
  width: auto;
  aspect-ratio: auto;

  &:not(:disabled):hover {
    transform: translateY(-2px);
    background-color: #d7d8db;
  }

  &:active {
    background-color: #e5e7eb;
    box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06);
  }

  @media (max-width: 640px) {
    width: 100%;
    padding: 14px 24px;
    font-size: 16px;
    gap: 8px;
  }

  @keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
  }
`;

const GoogleIcon = styled.svg`
  width: 24px;
  height: 24px;

  @media (max-width: 640px) {
    width: 20px;
    height: 20px;
  }
`;