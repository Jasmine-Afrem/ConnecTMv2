'use client';
import { useEffect, useState } from 'react';

export default function TestPage() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/protected', {
          method: 'GET',
          credentials: 'include', // Include cookies
        });

        // Log the response status and body before trying to parse as JSON
        const text = await response.text();
        console.log('Raw response:', text);  // Log the raw response

        // Now attempt to parse the response as JSON
        const data = JSON.parse(text);  // Manually parse the response text

        console.log('Auth check response:', data); // For debugging

        if (response.ok && data.success) {
          setLoggedIn(true);
          setUserId(data.userId); // Set userId from the response
          setEmail(data.email); // Set email from the response
        } else {
          setLoggedIn(false);
          alert(data.message); // Alert message from server if not logged in
        }
      } catch (error: unknown) {
        // Handle error (showing alert from client-side)
        if (error instanceof Error) {
          alert('Error checking authentication: ' + error.message);
        } else {
          alert('Unknown error: ' + String(error));
        }
        setLoggedIn(false);
      }
    };

    checkAuth();
  }, []);

  if (loggedIn === null) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {loggedIn ? (
        <h1>Welcome back, {email}! Your user ID is {userId},{email}</h1>
      ) : (
        <h1>Please log in to access this page</h1>
      )}
    </div>
  );
}
