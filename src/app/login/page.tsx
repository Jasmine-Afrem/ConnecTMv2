'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { InputField } from './inputfield';
import { Button } from './button';
import { GoogleLoginButton } from './googleloginbutton';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import axios from 'axios';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter(); // Initialize router for redirection

  const loginApi = async (email: string, password: string) => {
    try {
      const response = await axios.post('api/users/login', {
        email,
        password,
      });
      return response.data; // Assuming response contains user info or token
    } catch (err) {
      console.error('Login error:', err);
      throw new Error('Login failed');
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    // Check for empty fields
    if (!email || !password) {
      setError('Please fill all fields');
      setLoading(false);
      return;
    }

    try {
      // Call the loginApi function
      await loginApi(email, password);

      // After successful login, redirect to the main page
      toast.success('Login successful!');
      router.push('/main'); // Redirect to dashboard
    } catch (err) {
      console.log(err);
      setError('An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <LoginCard>
        <h1 className="login-title">Login</h1>
        <Form onSubmit={handleSubmit}>
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
          <RememberMeWrapper>
            <label className="remember-me">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
          </RememberMeWrapper>
          <Button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          <GoogleLoginWrapper>
            <GoogleLoginButton />
          </GoogleLoginWrapper>
        </Form>
      </LoginCard>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #424a59;
`;

const LoginCard = styled.main`
  background-color: rgba(31, 41, 55, 0.95);
  padding: 40px;
  border-radius: 20px;
  width: 50%;
  max-width: 400px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(16px);
  transition: all 0.4s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 90%; /* Set max height to avoid overflow */
  overflow: auto;

  .login-title {
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
    background-size: unset;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  /* Responsive for medium-sized screens */
  @media (max-width: 768px) {
    width: 80%;
    padding: 30px;
    .login-title {
      font-size: 2rem;
    }
  }

  /* Responsive for small screens */
  @media (max-width: 480px) {
    width: 90%;
    padding: 20px;
    .login-title {
      font-size: 1.5rem;
    }
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  background-color: transparent;
  padding: 0;
  border-radius: 10px;
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

const RememberMeWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #9ca3af;
  gap: 10px;
  margin: 8px 0 16px;

  .remember-me {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 16px;
    padding: 4px 0;
    margin-left: 12px;
  }
`;

const GoogleLoginWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 16px;
  width: 100%;
  justify-content: center;
`;

export default LoginForm;
