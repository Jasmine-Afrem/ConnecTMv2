'use client';
import { useEffect, useState } from 'react';

interface Profile {
  user_id: number;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  bio: string;
  profile_image_url: string | null;
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    bio: '',
    profileImageUrl: '',
  });
  const [userId, setUserId] = useState(3); // Assuming the user ID is 3 for testing
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  // Fetch profile
  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/profile?userId=${userId}`);
      const data = await response.json();
      if (data.profile) {
        setProfile(data.profile);
        setFormData({
          firstName: data.profile.first_name || '',
          lastName: data.profile.last_name || '',
          phone: data.profile.phone || '',
          address: data.profile.address || '',
          bio: data.profile.bio || '',
          profileImageUrl: data.profile.profile_image_url || '',
        });
      } else {
        setError('Profile not found.');
      }
    } catch (err) {
      setError('Failed to fetch profile data.');
    } finally {
      setLoading(false);
    }
  };

  // Handle form data change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle update
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName) {
      setError('First Name and Last Name are required.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          address: formData.address,
          bio: formData.bio,
          profileImageUrl: formData.profileImageUrl,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Profile updated successfully');
        fetchProfile(); // Refresh profile
      } else {
        setError(data.error || 'Failed to update profile.');
      }
    } catch (err) {
      setError('Error updating profile.');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/profile?userId=${userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        alert('Profile deleted successfully');
        setProfile(null); // Clear the profile
      } else {
        setError(data.error || 'Failed to delete profile.');
      }
    } catch (err) {
      setError('Error deleting profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>User Profile</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {profile ? (
        <div>
          <h2>Profile Information</h2>
          {/* Handle the profile image URL gracefully */}
          {profile.profile_image_url ? (
            <img src={profile.profile_image_url} alt="Profile" width="100" />
          ) : (
            <img src="/images/default-profile.png" alt="Default Profile" width="100" />
          )}
          <p>Name: {profile.first_name || 'No First Name'} {profile.last_name || 'No Last Name'}</p>
          <p>Phone: {profile.phone || 'No Phone'}</p>
          <p>Address: {profile.address || 'No Address'}</p>
          <p>Bio: {profile.bio || 'No Bio available'}</p>

          <h3>Update Profile</h3>
          <form onSubmit={handleUpdate}>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
            />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
            />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
            />
            <input
              type="text"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Bio"
            />
            <input
              type="text"
              name="profileImageUrl"
              value={formData.profileImageUrl}
              onChange={handleChange}
              placeholder="Profile Image URL"
            />
            <button type="submit">Update Profile</button>
          </form>

          <button onClick={handleDelete} style={{ marginTop: '10px' }}>Delete Profile</button>
        </div>
      ) : (
        <p>Profile not found.</p>
      )}
    </div>
  );
};

export default ProfilePage;
