/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { CoinPackageCard } from '@/app/funds/coinpackagecard';
import { Button } from '@/app/funds/button'; // Ensure the correct import path
import Header from '@/app/main/header'; // Ensure the correct import path
import { useRouter } from 'next/navigation';
import Loading from '@/app/loading/loading'; // Import Loading component

interface User {
  email: string;
  profilePicture?: string;
}

interface FundsManagementModalProps {
  onClose: () => void;
  skillPoints: number;
}

export const FundsManagementModal: React.FC<FundsManagementModalProps> = ({
  onClose,
  skillPoints
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>(0);
  const [coins, setCoins] = useState<number>(0);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const router = useRouter();

  // Check if user is logged in using JWT
  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/protected', {
        method: 'GET',
        credentials: 'include', // Sends cookies with request (e.g. JWT token)
      });

      const text = await response.text();
      const data = JSON.parse(text);

      if (response.ok && data.success) {
        setUser({ email: data.email, profilePicture: data.profilePicture });
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        setUser(null);
        alert(data.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        alert('Error checking authentication: ' + error.message);
      } else {
        alert('Unknown error: ' + String(error));
      }
      setIsLoggedIn(false);
    } finally {
      setLoading(false); // Set loading to false after the auth check is done
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const signOut = async () => {
    try {
      document.cookie = "token=; path=/; domain=" + window.location.hostname + "; max-age=0; SameSite=Strict; Secure";
      setUser(null);
      setIsLoggedIn(false);
      await fetch('/api/users/logout', { method: 'POST', credentials: 'include' });
      router.push('/main');
    } catch (error) {
      console.error('Error during sign-out:', error);
    }
  };

  const signIn = () => {
    router.push('/login');
  };

  const handleBuyCoins = async (amount: number) => {
    try {
      if (!isLoggedIn) {
        alert('You need to log in to purchase coins');
        return;
      }
  
      // Send request to API to update user's coin balance
      const response = await fetch('/api/purchaseCoins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user?.email, // Ensure this is the logged-in user's email
          coins: amount,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Update coins and balance after purchase
        setCoins(prevCoins => prevCoins + amount);
        setBalance(prevBalance => prevBalance - amount); // Assuming you want to subtract from balance too
        alert(`Successfully purchased ${amount} coins!`);
      } else {
        alert('Failed to purchase coins: ' + data.message);
      }
    } catch (error) {
      console.error('Error purchasing coins:', error);
      alert('Error purchasing coins');
    }
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

  if (loading) {
    return <Loading />; // Show the loading screen while waiting for auth
  }

  return (
    <StyledFundsManagementModal>
      {/* Rendering the Header Component */}
      <Header 
        user={user}
        signIn={signIn} 
        signOut={signOut} 
        eventStats={{ activeUsers: skillPoints, totalEvents: 0 }} 
      />

      {/* Modal Section */}
      <ModalOverlay>
        <ModalContent>
          <header>
            <h1>Welcome to your wallet, {user ? user.email : 'Guest'}!</h1>
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
  max-width: 1400px; /* Add this to match the width limit of SkillSharePlatform */
  margin: 0 auto;
  
  @media (max-width: 640px) {
    padding: 10px;
    min-height: auto;
  }
`;

const ModalOverlay = styled.div`
  background-color: #424a59;
  background-image: url('https://www.shutterstock.com/image-vector/business-job-icon-doodle-seamless-600nw-2285217401.jpg');
  min-height: 110vh;
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
  padding: 60px;
  padding-top: 60px;
  background-color: rgba(15, 20, 84, 0.93);
  border-radius: 16px;
  width: 100%;
  max-width: 1200px;
  color: white;
  text-align: center;

  h1 {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 70px;
  }

  h2 {
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 20px;
  }

  @media (max-width: 640px) {
    padding: 30px;
    width: 100%;
    margin: 20px;
  }
`;

const BalanceSection = styled.section`
  background-color: rgba(76, 175, 80, 1);
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 40px;

  @media (max-width: 640px) {
    padding: 20px;
  }
`;

const CurrentBalance = styled.div`
  font-size: 36px;
  color: white;

  @media (max-width: 640px) {
    font-size: 28px;
  }
`;

const BalanceLabel = styled.div`
  color: rgba(255, 255, 255, 1);
`;

const CoinsSection = styled.section`
  background-color: #31377a;
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
  color: rgba(255, 255, 255, 0.9);
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 15px;
  font-weight: 400;
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
  gap: 20px;
`;


export default FundsManagementModal;