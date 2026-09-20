import { useState, useEffect } from 'react';

export interface UserProfile {
  name: string;
  ticketNumber: string;
  points: number;
  redeemedCodes: string[];
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('metanoia_user_profile');
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
      } catch (e) {
        console.error('Error parsing profile', e);
      }
    }
    setIsLoaded(true);
  }, []);

  const saveProfile = (newProfile: UserProfile) => {
    localStorage.setItem('metanoia_user_profile', JSON.stringify(newProfile));
    setProfile(newProfile);
  };

  const createProfile = (name: string) => {
    // Generate a pseudo-random ticket number like "MTN-8X2A"
    const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
    const ticketNumber = `MTN-${randomChars}`;
    
    const newProfile: UserProfile = {
      name,
      ticketNumber,
      points: 0,
      redeemedCodes: []
    };
    saveProfile(newProfile);
  };

  const addPoints = (points: number, code: string) => {
    if (!profile) return false;
    if (profile.redeemedCodes.includes(code)) return false; // Already redeemed

    const newProfile = {
      ...profile,
      points: profile.points + points,
      redeemedCodes: [...profile.redeemedCodes, code]
    };
    saveProfile(newProfile);
    return true;
  };

  return { profile, isLoaded, createProfile, addPoints };
}
