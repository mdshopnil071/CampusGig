import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const SavedGigsContext = createContext(null);

export const SavedGigsProvider = ({ children }) => {
  const [savedGigs, setSavedGigs] = useState(() => {
    try {
      const stored = localStorage.getItem('campusgig_saved_gigs');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('campusgig_saved_gigs', JSON.stringify(savedGigs));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [savedGigs]);

  const isSaved = (gigId) => {
    return savedGigs.some((g) => g.id === gigId);
  };

  const toggleSave = (gig) => {
    if (!gig || !gig.id) return;

    if (isSaved(gig.id)) {
      setSavedGigs((prev) => prev.filter((g) => g.id !== gig.id));
      toast.success('Removed from saved gigs');
    } else {
      setSavedGigs((prev) => [gig, ...prev]);
      toast.success('Saved to your wishlist! 💖');
    }
  };

  const removeSaved = (gigId) => {
    setSavedGigs((prev) => prev.filter((g) => g.id !== gigId));
    toast.success('Gig removed from wishlist');
  };

  return (
    <SavedGigsContext.Provider
      value={{
        savedGigs,
        isSaved,
        toggleSave,
        removeSaved,
        savedCount: savedGigs.length,
      }}
    >
      {children}
    </SavedGigsContext.Provider>
  );
};

export const useSavedGigs = () => {
  const context = useContext(SavedGigsContext);
  if (!context) {
    throw new Error('useSavedGigs must be used within a SavedGigsProvider');
  }
  return context;
};
