'use client'; // To enable client-side rendering for the form

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!username || !email || !password) {
      toast.error('Please fill all fields.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('/api/users/signup', {
        username,
        email,
        password,
      });

      if (response.data.success) {
        toast.success('Signup successful!');
        router.push('/login'); // Redirect to login page after successful signup
      } else {
        toast.error(response.data.message || 'Signup failed');
      }
    } catch (error) {
      toast.error('An error occurred during signup.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto">
      <h1 className="text-2xl font-semibold">Create Account</h1>
      <hr />
      <form onSubmit={handleSubmit} className="w-full mt-4">
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md text-black"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md text-black"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm text-black">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md text-black"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-500 text-white rounded-md"
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
