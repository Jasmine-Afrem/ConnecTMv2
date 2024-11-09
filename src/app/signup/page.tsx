'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { InputField } from '@/app/login/inputfield';
import { Button } from '@/app/login/button';
import { GoogleLoginButton } from '@/app/login/googleloginbutton';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import axios from 'axios';

export const SignupPage: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const signupApi = async (username: string, email: string, password: string) => {
    try {
      const response = await axios.post('/api/users/signup', { username, email, password });
      return response.data;
    } catch (err) {
      console.error('Signup error:', err);
      throw new Error('Signup failed');
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!username || !email || !password) {
      setError('Please fill all fields');
      setLoading(false);
      return;
    }

    try {
      await signupApi(username, email, password);
      toast.success('Signup successful!');
      router.push('/login');
    } catch (err) {
      setError('An error occurred during signup.');
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <Container>
      <SignupCard>
        <h1 className="signup-title">Create Account</h1>
        <Form onSubmit={handleSubmit}>
          <InputField
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
          <InputField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
          {error && (
            <ErrorMessage>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z" />
              </svg>
              <span>{error}</span>
            </ErrorMessage>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>
          <GoogleLoginWrapper>
            <GoogleLoginButton />
          </GoogleLoginWrapper>
        </Form>
      </SignupCard>
    </Container>
  );
};

// Styled components with identical styling to LoginForm
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #424a59;
`;

const SignupCard = styled.main`
  background-color: rgba(31, 41, 55, 0.95);
  padding: 40px;
  border-radius: 20px;
  width: 50%;
  max-width: 400px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(16px);
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 90%;
  overflow: auto;

  .signup-title {
    font-size: 2.5rem;
    font-weight: 900;
    color: #ffffff;
    margin-bottom: 42px;
    text-align: center;
    letter-spacing: -0.5px;
    background: linear-gradient(135deg, #fafcff, #c9ccd1);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    width: 80%;
    padding: 30px;
    .signup-title {
      font-size: 2rem;
    }
  }

  @media (max-width: 480px) {
    width: 90%;
    padding: 20px;
    .signup-title {
      font-size: 1.5rem;
    }
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 14px;
  margin-top: 8px;
  padding: 8px 12px;
  background-color: rgba(239, 68, 68, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const GoogleLoginWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 16px;
  width: 100%;
  justify-content: center;
`;

export default SignupPage;
