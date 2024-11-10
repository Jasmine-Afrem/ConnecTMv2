'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { InputField } from './inputfield';
import { Button } from './button';
import { GoogleLoginButton } from './googleloginbutton';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import axios from 'axios';

export const LoginForm: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false); // Track if component is mounted
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // Set `isMounted` to true only after the client-side rendering has occurred
    setIsMounted(true);

    // Check if email and password are saved in localStorage
    const storedEmail = localStorage.getItem('email');
    const storedPassword = localStorage.getItem('password');
    if (storedEmail && storedPassword) {
      setEmail(storedEmail);
      setPassword(storedPassword);
      setRememberMe(true); // Automatically check the "Remember me" box
    }
  }, []);

  const loginApi = async (email: string, password: string) => {
    try {
      const response = await axios.post('/api/users/login', { email, password });
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
      // Call the login API function
      await loginApi(email, password);

      // After successful login, handle "Remember me" functionality
      if (rememberMe) {
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);
      } else {
        localStorage.removeItem('email');
        localStorage.removeItem('password');
      }

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

  // Navigate to the Sign Up page
  const handleSignUpRedirect = () => {
    router.push('/signup');
  };

  // Avoid SSR mismatch by only rendering after mounting
  if (!isMounted) return null;

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
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
          </RememberMeWrapper>
          <Button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          <GoogleLoginWrapper>
            <GoogleLoginButton />
          </GoogleLoginWrapper>

          {/* Sign Up Redirect Button */}
          <SignUpRedirect type="button" onClick={handleSignUpRedirect}>
            Don&#39;t have an account? <span>Sign Up</span>
          </SignUpRedirect>
        </Form>
      </LoginCard>
    </Container>
  );
};

// Styled components remain the same
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #424a59;
  background-image: url('https://www.shutterstock.com/image-vector/business-job-icon-doodle-seamless-600nw-2285217401.jpg');
`;

const LoginCard = styled.main`
  background-color: rgba(15, 20, 84, 0.8); 
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
  max-height: 90%;
  overflow: auto;

  .login-title {
    font-size: 2.5rem;
    font-weight: 900;
    color: #ffffff;
    margin-bottom: 42px;
    text-align: center;
    letter-spacing: -0.5px;
    background: linear-gradient(135deg, #ffff, #ffff);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    width: 80%;
    padding: 30px;
    .login-title {
      font-size: 2rem;
    }
  }

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

const SignUpRedirect = styled.button`
  background: none;
  border: none;
  color: #ffff;
  font-size: 14px;
  cursor: pointer;
  text-align: center;
  margin-top: 16px;
  span {
    font-weight: 600;
    text-decoration: underline;
  }
  &:hover {
    color: #dedede;
  }
`;

export default LoginForm;
