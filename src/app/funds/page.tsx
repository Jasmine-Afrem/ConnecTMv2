/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { CoinPackageCard } from '@/app/funds/coinpackagecard';
import { Button } from '@/app/funds/button'; // Ensure the correct import path
import Header from '@/app/main/header'; // Ensure the correct import path

interface FundsManagementModalProps {
  onClose: () => void;
  user: User | null;
  skillPoints: number;
  signIn: (email: string, password: string) => void;
  signOut: () => void;
}

interface User {
  email: string;
}

export const FundsManagementModal: React.FC<FundsManagementModalProps> = ({
  onClose,
  user,
  skillPoints,
  signIn,
  signOut
}) => {
  const [balance, setBalance] = useState<number>(0);
  const [coins, setCoins] = useState<number>(0);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const handleBuyCoins = (amount: number) => {
    // Implementation for buying coins
  };

  const handleWithdrawFunds = (amount: number) => {
    // Implementation for withdrawing funds
  };

  const coinPackages = [
    { coins: 100, price: 5, popular: false, bestDeal: false },
    { coins: 500, price: 20, popular: true, bestDeal: false },
    { coins: 1000, price: 35, popular: false, bestDeal: false },
    { coins: 2500, price: 75, popular: false, bestDeal: true },
  ];

  return (
    <StyledFundsManagementModal>
      {/* Rendering the Header Component */}
      <Header 
        user={user} 
        skillPoints={skillPoints} 
        signIn={signIn} 
        signOut={signOut} 
      />

      {/* Modal Section */}
      <ModalOverlay>
        <ModalContent>
          <header>
            <h1>Welcome back!</h1>
          </header>
          <main>
            <BalanceSection>
              <CurrentBalance>
                <span>$</span>
                <span>{balance.toFixed(2)}</span>
              </CurrentBalance>
              <BalanceLabel>Current Balance</BalanceLabel>
            </BalanceSection>
            <CoinsSection>
              <AvailableCoins>
                <span>{coins}</span>
                <span> Coins</span>
              </AvailableCoins>
              <CoinsLabel>Available Coins</CoinsLabel>
            </CoinsSection>
            <ActionButtons>
              <Button onClick={() => handleBuyCoins(100)} primary>Buy Coins</Button>
              <Button onClick={() => handleWithdrawFunds(100)} secondary>Withdraw Funds</Button>
            </ActionButtons>
            <CoinPackages>
              <h2>Available Coin Packages</h2>
              <PackageGrid>
                {coinPackages.map((pkg, index) => (
                  <CoinPackageCard
                    key={index}
                    coins={pkg.coins}
                    price={pkg.price}
                    popular={pkg.popular}
                    bestDeal={pkg.bestDeal}
                    onPurchase={() => handleBuyCoins(pkg.coins)}
                  />
                ))}
              </PackageGrid>
            </CoinPackages>
          </main>
        </ModalContent>
      </ModalOverlay>
    </StyledFundsManagementModal>
  );
};

// Styled Components (Funds Management Modal)
const StyledFundsManagementModal = styled.div`
  background-color: #424a59;
  min-height: 100vh;
  padding: 20px;
  @media (max-width: 640px) {
    padding: 10px;
    min-height: auto;
  }
`;

const ModalOverlay = styled.div`
  background-color: #424a59;
  min-height: 100vh;
  padding: 40px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  backdrop-filter: blur(8px);
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 640px) {
    padding: 20px;
  }
`;

const ModalContent = styled.div`
  max-width: 90%;
  margin: 20px auto;
  margin-top: 80px;
  padding: 60px;
  background-color: #1e293b;
  border-radius: 16px;
  width: 100%;
  max-width: 1200px;
  color: white;
  text-align: center;

  h1 {
    font-size: 24px;
    margin-bottom: 70px; /* Increased the bottom margin to create more space */
  }

  h2 {
    font-size: 20px;
    margin-bottom: 20px;
  }

  @media (max-width: 640px) {
    padding: 30px;
    width: 100%;
    margin: 20px;
  }
`;

const BalanceSection = styled.section`
  background-color: rgba(76, 175, 80, 0.1);
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 40px;

  @media (max-width: 640px) {
    padding: 20px;
  }
`;

const CurrentBalance = styled.div`
  font-size: 36px;
  color: #4caf50;

  @media (max-width: 640px) {
    font-size: 28px;
  }
`;

const BalanceLabel = styled.div`
  color: rgba(255, 255, 255, 0.7);
`;

const CoinsSection = styled.section`
  background-color: rgba(255, 255, 255, 0.05);
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 40px;

  @media (max-width: 640px) {
    padding: 20px;
  }
`;

const AvailableCoins = styled.div`
  font-size: 24px;

  @media (max-width: 640px) {
    font-size: 20px;
  }
`;

const CoinsLabel = styled.div`
  color: rgba(255, 255, 255, 0.7);
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 20px;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const CoinPackages = styled.section`
  margin-top: 50px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 40px;

  @media (max-width: 640px) {
    margin-top: 30px;
    padding-top: 30px;
  }
`;

const PackageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 25px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr; /* Stacks the coin packages on mobile */
    gap: 20px;
  }
`;

export default FundsManagementModal;