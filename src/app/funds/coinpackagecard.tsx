'use client';

import React from 'react';
import styled from 'styled-components';
import { Button } from './button';

interface CoinPackageCardProps {
  coins: number;
  price: number;
  popular: boolean;
  bestDeal: boolean;
  onPurchase: () => void;
}

export const CoinPackageCard: React.FC<CoinPackageCardProps> = ({
  coins,
  price,
  popular,
  bestDeal,
  onPurchase,
}) => {
  return (
    <CardWrapper $popular={popular} $bestDeal={bestDeal}>
      {popular && <PopularTag>Most Popular</PopularTag>}
      {bestDeal && <BestDealTag>Best Deal</BestDealTag>}
      <CoinAmount>{coins} Coins</CoinAmount>
      <Price>${price.toFixed(2)}</Price>
      <Button onClick={onPurchase} primary={true}>Purchase</Button>
    </CardWrapper>
  );
};

const CardWrapper = styled.div<{ $popular: boolean; $bestDeal: boolean }>`
  background-color: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 12px;
  border: ${props => props.$popular || props.$bestDeal ? '2px solid #4caf50' : '1px solid rgba(76, 175, 80, 0.2)'};
  text-align: center;
  transition: transform 0.2s;
  cursor: pointer;
  position: relative;
`;

const PopularTag = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #4caf50;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
`;

const BestDealTag = styled(PopularTag)``;

const CoinAmount = styled.div`
  font-size: 24px;
  color: #4caf50;
  margin-bottom: 5px;
`;

const Price = styled.div`
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 10px;
`;