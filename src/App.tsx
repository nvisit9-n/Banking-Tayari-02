/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { AppProvider } from './context/AppContext';
import { Dashboard } from './components/Dashboard';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { UserProfile } from './types';
import { StorageService } from './services/storageService';

export default function App() {
  // Authentication State: Dynamic authenticated profile or Guest User Profile
  const [user, setUser] = useState<UserProfile>(() => StorageService.getUserProfile());

  // Logout handler: completely clear active profile and reset to Guest User
  const handleLogout = useCallback(() => {
    StorageService.clearUserProfile();
    const guest = StorageService.getGuestProfile();
    setUser(guest);
    window.dispatchEvent(new CustomEvent('btn:logout'));
    window.dispatchEvent(new CustomEvent('btn:profile-updated', { detail: guest }));
  }, []);

  // Login success handler: persist real user session
  const handleLoginSuccess = useCallback((profile: UserProfile) => {
    StorageService.saveUserProfile(profile);
    setUser(profile);
    window.dispatchEvent(new CustomEvent('btn:profile-updated', { detail: profile }));
  }, []);

  // Listen for storage events and cross-tab/subcomponent auth triggers
  useEffect(() => {
    const syncAuth = () => {
      const activeProfile = StorageService.getUserProfile();
      setUser(activeProfile);
    };

    const handleProfileUpdated = (e: Event) => {
      const customEvt = e as CustomEvent<UserProfile>;
      if (customEvt.detail) {
        setUser(customEvt.detail);
      } else {
        syncAuth();
      }
    };

    window.addEventListener('storage', syncAuth);
    window.addEventListener('btn:logout', handleLogout);
    window.addEventListener('btn:profile-updated', handleProfileUpdated);

    return () => {
      window.removeEventListener('storage', syncAuth);
      window.removeEventListener('btn:logout', handleLogout);
      window.removeEventListener('btn:profile-updated', handleProfileUpdated);
    };
  }, [handleLogout]);

  // Render Main Dashboard interface within AppProvider.
  // LoginModal is managed globally via AppContext (openLoginModal/closeLoginModal).
  return (
    <ErrorBoundary>
      <AppProvider initialUser={user}>
        <Dashboard user={user} onLogout={handleLogout} />
      </AppProvider>
    </ErrorBoundary>
  );
}
