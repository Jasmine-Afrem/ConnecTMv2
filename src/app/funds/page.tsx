'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { CoinPackageCard } from '@/app/funds/coinpackagecard';
import { Button } from '@/app/funds/button';
import Header from '@/app/main/header';
import { useRouter } from 'next/navigation';
import Loading from '@/app/loading/loading'; // Import Loading component

interface User {
  email: string;
  profilePicture?: string;
  id: number;
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

  // Function to convert coins to dollars
  const convertCoinsToDollars = (coins: number) => {
    const ratio = 26.725; // Average ratio
    return coins / ratio;
  };

  // Check if user is logged in
  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/protected', {
        method: 'GET',
        credentials: 'include',
      });

      const text = await response.text();
      console.log('Raw response:', text);  // Log the raw response

      const data = JSON.parse(text);  // Manually parse the response text
      console.log('Auth check response:', data);

      if (response.ok && data.success) {
        setUser({ email: data.email, profilePicture: data.profilePicture, id: data.userId });
        setIsLoggedIn(true);
        await fetchUserCoins(data.userId); // Fetch user coins after authentication
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

  // Fetch user coins
  const fetchUserCoins = async (userId: number) => {
    try {
      const response = await fetch(`/api/funds?userId=${userId}`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        const coins = data.points;
        const balance = convertCoinsToDollars(coins);
        setCoins(coins);
        setBalance(balance);
      } else {
        alert('Failed to fetch user coins: ' + data.error);
      }
    } catch (error) {
      console.error('Error fetching user coins:', error);
      alert('Error fetching user coins');
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const signOut = async () => {
    try {
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

      console.log('User ID:', user.id);
      console.log('Amount:', amount);

      const response = await fetch(`/api/funds?userId=${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          amount: amount,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await fetchUserCoins(user.id);
        alert(`Successfully purchased ${amount} coins!`);
      } else {
        alert('Failed to purchase coins: ' + data.error);
      }
    } catch (error) {
      console.error('Error purchasing coins:', error);
      alert('Error purchasing coins');
    }
  };

  const handleWithdrawFunds = async (amount: number) => {
    try {
      if (!isLoggedIn) {
        alert('You need to log in to withdraw funds');
        return;
      }

      console.log('User ID:', user.id);
      console.log('Amount:', amount);

      const response = await fetch(`/api/funds?userId=${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          amount: amount,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await fetchUserCoins(user.id);
        alert(`Successfully withdrew ${amount} coins!`);
      } else {
        alert('Failed to withdraw funds: ' + data.error);
      }
    } catch (error) {
      console.error('Error withdrawing funds:', error);
      alert('Error withdrawing funds');
    }
  };

  const coinPackages = [
    { coins: 100, price: 5, popular: false, bestDeal: false },
    { coins: 500, price: 20, popular: true, bestDeal: false },
    { coins: 1000, price: 35, popular: false, bestDeal: false },
    { coins: 2500, price: 75, popular: false, bestDeal: true },
  ];

  if (loading) {
    return <Loading loading={loading} />; // Show the loading screen while waiting for auth
  }

  return (
    <StyledFundsManagementModal>
      <Header 
        user={user}
        signIn={signIn} 
        signOut={signOut} 
        eventStats={{ activeUsers: skillPoints, totalEvents: 0 }} 
      />

      <ModalOverlay>
        <ModalContent>
          <header>
            <h1>Welcome to your wallet, {user ? user.email : 'Guest'}!</h1>
          </header>
          <main>
            <BalanceSection>
              <CurrentBalance>
                <span>$</span>
                <span>{balance ? balance.toFixed(2) : '0.00'}</span>
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
