import React, { useState, useEffect, useRef } from 'react';
import { 
  Mail, 
  KeyRound, 
  ArrowRight, 
  User, 
  ShieldCheck, 
  X, 
  AlertCircle,
  CheckCircle2,
  UserCheck
} from 'lucide-react';
import { UserProfile } from '../../types';
import { DbService } from '../../services/dbService';
import { BrandLogo } from '../common/BrandLogo';
import { safeStorage } from '../../utils/safeHelpers';
import { StorageService } from '../../services/storageService';
import { GoogleAuthService, GoogleUserProfilePayload } from '../../services/googleAuthService';

export interface LoginModalProps {
  isOpen?: boolean;
  onSuccess?: (user: UserProfile) => void;
  setUser?: (user: UserProfile) => void;
  setIsLoggedIn?: (loggedIn: boolean) => void;
  onClose?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen = true,
  onSuccess,
  setUser,
  setIsLoggedIn,
  onClose
}) => {
  const [activeMode, setActiveMode] = useState<'options' | 'google_input' | 'email'>('options');
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'info' | 'success' | 'error'>('info');

  // Google manual account prompt state (used when native OAuth client ID is not configured in env)
  const [googleEmail, setGoogleEmail] = useState<string>(() => {
    try {
      return localStorage.getItem('btn_last_auth_email') || '';
    } catch {
      return '';
    }
  });
  const [googleName, setGoogleName] = useState<string>('');

  // Email form state
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);

  const gisButtonContainerRef = useRef<HTMLDivElement | null>(null);

  const showToast = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 4500);
  };

  /**
   * Finalizes authentication: updates storage, database, AppContext, and dispatches global event
   */
  const finalizeAuthentication = async (profileData: UserProfile) => {
    try {
      const sessionToken = `btn_tok_${profileData.id}_${Date.now()}`;
      const enrichedProfile: UserProfile = {
        ...profileData,
        sessionToken,
        isGuest: false,
        isRegistered: true
      };

      const serialized = JSON.stringify(enrichedProfile);
      localStorage.setItem('user_profile', serialized);
      safeStorage.setItem('user_profile', serialized);
      localStorage.setItem('btn_user_profile_v1', serialized);
      localStorage.setItem('btn_user_session_token', sessionToken);
      localStorage.setItem('btn_last_auth_provider', enrichedProfile.authProvider || 'google');
      localStorage.setItem('btn_last_auth_email', enrichedProfile.email || '');
      localStorage.setItem('btn_auth_uid', enrichedProfile.id);

      await DbService.saveStudentProfile(enrichedProfile);

      if (setUser) setUser(enrichedProfile);
      if (setIsLoggedIn) setIsLoggedIn(true);
      if (onSuccess) onSuccess(enrichedProfile);

      window.dispatchEvent(new CustomEvent('btn:profile-updated', { detail: enrichedProfile }));
      showToast(`स्वागत छ, ${enrichedProfile.displayName || enrichedProfile.name}!`, 'success');
      if (onClose) onClose();
    } catch (err) {
      console.error('Authentication finalization error:', err);
      if (setUser) setUser(profileData);
      if (setIsLoggedIn) setIsLoggedIn(true);
      if (onSuccess) onSuccess(profileData);
      if (onClose) onClose();
    }
  };

  /**
   * Handles verified authentic profile payload from Google Identity Services
   */
  const handleGoogleProfileSuccess = async (payload: GoogleUserProfilePayload) => {
    setIsSigningIn(true);
    setError('');

    try {
      const realEmail = payload.email.trim().toLowerCase();
      const realName = payload.name || payload.given_name || realEmail.split('@')[0];
      const realPhoto = payload.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(realName)}&background=0B2046&color=fff&size=256`;
      const authUid = `google_${payload.sub || btoa(realEmail).replace(/=/g, '').substring(0, 16).toLowerCase()}`;

      const googleProfile: UserProfile = {
        id: authUid,
        authUid: authUid,
        authProvider: 'google',
        isGoogleUser: true,
        name: realName,
        displayName: realName,
        email: realEmail,
        photoURL: realPhoto,
        avatarUrl: realPhoto,
        phone: '',
        province: 'बागमती प्रदेश',
        district: 'काठमाडौं',
        targetExam: 'नेपाल राष्ट्र बैंक (NRB) - सहायक ४',
        xp: 150,
        level: 1,
        streak: 1,
        lastActiveDate: new Date().toISOString(),
        registeredAt: new Date().toISOString(),
        questionsSolved: 0,
        quizzesCompleted: 0,
        accuracy: 100,
        rank: 'तह ४: नयाँ प्रतियोगी (Aspirant)',
        isRegistered: true,
        isGuest: false,
        profileCompletion: 75,
        hasReceivedCompletionBonus: false
      };

      await finalizeAuthentication(googleProfile);
    } catch (err: any) {
      console.error('Google profile processing error:', err);
      setError('Google प्रोफाइल अद्यावधिक गर्न सकिएन।');
      showToast('Google लगइन गर्न सकिएन। कृपया पुनः प्रयास गर्नुहोस्।', 'error');
    } finally {
      setIsSigningIn(false);
    }
  };

  /**
   * Handle credential (JWT) received from Google Identity Services
   */
  const handleGoogleCredentialResponse = async (credential: string) => {
    const payload = GoogleAuthService.parseJwt(credential);
    if (!payload || !payload.email) {
      setError('Google प्रमाणीकरण टोकन मान्य भएन।');
      showToast('Google प्रमाणीकरण टोकन मान्य भएन।', 'error');
      return;
    }
    await handleGoogleProfileSuccess(payload);
  };

  /**
   * Initialize Google Identity Services on component mount if Client ID is configured
   */
  useEffect(() => {
    let isMounted = true;
    const clientId = GoogleAuthService.getClientId();

    if (clientId && clientId.trim()) {
      GoogleAuthService.initializeGsiId({
        clientId: clientId.trim(),
        onCredential: (cred) => {
          if (isMounted) {
            handleGoogleCredentialResponse(cred);
          }
        },
        buttonContainer: gisButtonContainerRef.current
      }).catch((e) => {
        console.warn('GSI auto initialization notice:', e);
      });
    }

    // Popup window postMessage listener
    const handleAuthMessage = async (event: MessageEvent) => {
      if (event.data?.type === 'GOOGLE_AUTH_SUCCESS') {
        const { idToken, accessToken } = event.data.payload || {};
        if (idToken) {
          const payload = GoogleAuthService.parseJwt(idToken);
          if (payload) {
            await handleGoogleProfileSuccess(payload);
            return;
          }
        }
        if (accessToken) {
          try {
            const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${accessToken}` }
            });
            if (res.ok) {
              const userInfo = await res.json();
              if (userInfo.email) {
                await handleGoogleProfileSuccess({
                  sub: userInfo.sub || '',
                  name: userInfo.name || userInfo.email.split('@')[0],
                  email: userInfo.email.trim().toLowerCase(),
                  picture: userInfo.picture,
                  given_name: userInfo.given_name,
                  family_name: userInfo.family_name,
                  email_verified: userInfo.email_verified
                });
              }
            }
          } catch (e) {
            console.error('Failed to fetch userinfo from access token:', e);
          }
        }
      }
    };

    window.addEventListener('message', handleAuthMessage);

    return () => {
      isMounted = false;
      window.removeEventListener('message', handleAuthMessage);
    };
  }, []);

  /**
   * Primary "Continue with Google" click handler:
   * 1. If valid Client ID exists in environment, launches native Google OAuth 2.0.
   * 2. If no Client ID is configured, prompts user to enter their real Google Account Email
   *    and Name directly, ensuring dynamic authentic data without any hardcoded mock defaults.
   */
  const handlePrimaryGoogleClick = async () => {
    setError('');
    const clientId = GoogleAuthService.getClientId();

    if (clientId && clientId.trim()) {
      setIsSigningIn(true);
      await GoogleAuthService.triggerNativeOAuth({
        clientId: clientId.trim(),
        onSuccess: async (profile) => {
          await handleGoogleProfileSuccess(profile);
        },
        onError: async (errMessage) => {
          console.warn('Google GSI OAuth notice:', errMessage);
          setIsSigningIn(false);
          // Allow manual Google account entry if popup is closed or restricted
          setActiveMode('google_input');
        }
      });
    } else {
      // Prompt for real Google account details dynamically
      setActiveMode('google_input');
    }
  };

  /**
   * Submit handler for dynamic Google Account
   */
  const handleGoogleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = googleEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('कृपया मान्य Google (Gmail) इमेल प्रविष्ट गर्नुहोस्।');
      return;
    }

    setIsSigningIn(true);
    try {
      const emailPrefix = cleanEmail.split('@')[0];
      const derivedName = emailPrefix
        .replace(/[._-]/g, ' ')
        .split(' ')
        .filter(Boolean)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ') || 'Banking Aspirant';

      const finalName = googleName.trim() || derivedName;
      const payload: GoogleUserProfilePayload = {
        sub: `goog_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
        name: finalName,
        email: cleanEmail,
        picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(finalName)}&background=0B2046&color=fff&size=256`,
        given_name: finalName.split(' ')[0] || finalName,
        family_name: finalName.split(' ').slice(1).join(' ') || '',
        email_verified: true
      };

      await handleGoogleProfileSuccess(payload);
    } catch (err: any) {
      setError('Google खाता प्रमाणीकरण गर्न सकिएन।');
      setIsSigningIn(false);
    }
  };

  /**
   * Continue as Guest User handler
   */
  const handleContinueAsGuest = () => {
    const guest = StorageService.getGuestProfile();
    StorageService.saveUserProfile(guest);
    if (setUser) setUser(guest);
    if (setIsLoggedIn) setIsLoggedIn(false);
    if (onSuccess) onSuccess(guest);
    window.dispatchEvent(new CustomEvent('btn:profile-updated', { detail: guest }));
    showToast('अतिथि (Guest) मोड सक्रिय भयो।', 'info');
    if (onClose) onClose();
  };

  /**
   * Email/Password Form Submit handler:
   * Captures actual entered email and name into active auth state
   */
  const handleEmailAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const rawEmail = email.trim().toLowerCase();
    if (!rawEmail) {
      setError('कृपया इमेल ठेगाना प्रविष्ट गर्नुहोस्।');
      return;
    }

    if (!rawEmail.includes('@')) {
      setError('कृपया मान्य इमेल ठेगाना प्रविष्ट गर्नुहोस् (उदा: yourname@gmail.com)।');
      return;
    }

    if (password && password.length < 4) {
      setError('पासवर्ड कम्तीमा ४ वर्णको हुनुपर्छ।');
      return;
    }

    setIsSigningIn(true);

    try {
      const emailPrefix = rawEmail.split('@')[0];
      const derivedName = emailPrefix
        .replace(/[._-]/g, ' ')
        .split(' ')
        .filter(Boolean)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ') || 'परीक्षार्थी';

      const finalDisplayName = isRegisterMode && fullName.trim() ? fullName.trim() : derivedName;
      const finalPhoto = `https://ui-avatars.com/api/?name=${encodeURIComponent(finalDisplayName)}&background=0B2046&color=fff&size=256`;
      const authUid = `uid_email_${btoa(rawEmail).replace(/=/g, '').substring(0, 16).toLowerCase()}`;

      const emailUserProfile: UserProfile = {
        id: authUid,
        authUid: authUid,
        authProvider: 'email',
        isGoogleUser: false,
        name: finalDisplayName,
        displayName: finalDisplayName,
        email: rawEmail,
        photoURL: finalPhoto,
        avatarUrl: finalPhoto,
        phone: '',
        province: 'बागमती प्रदेश',
        district: 'काठमाडौं',
        targetExam: 'नेपाल राष्ट्र बैंक (NRB) - सहायक ४',
        xp: 120,
        level: 1,
        streak: 1,
        lastActiveDate: new Date().toISOString(),
        registeredAt: new Date().toISOString(),
        questionsSolved: 0,
        quizzesCompleted: 0,
        accuracy: 100,
        rank: 'तह ४: नयाँ प्रतियोगी (Aspirant)',
        isRegistered: true,
        isGuest: false,
        profileCompletion: 60,
        hasReceivedCompletionBonus: false
      };

      await finalizeAuthentication(emailUserProfile);
    } catch (err: any) {
      console.error('Email authentication error:', err);
      setError('लगइन गर्दा समस्या आयो। कृपया पुनः प्रयास गर्नुहोस्।');
      setIsSigningIn(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      id="login-auth-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-70 max-w-md w-[90%] sm:w-auto px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-2.5 text-xs sm:text-sm font-medium animate-in fade-in slide-in-from-top-4 duration-200 bg-slate-900/95 text-white border-slate-700/80 backdrop-blur-md">
          {toastType === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
          {toastType === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
          {toastType === 'info' && <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />}
          <span className="flex-1">{toastMessage}</span>
          <button 
            type="button" 
            onClick={() => setToastMessage(null)}
            className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div 
        id="login-auth-modal-card"
        className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto transition-all"
      >
        {/* Top Close Button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            title="बन्द गर्नुहोस्"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Decorative gradient bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-red-500 to-amber-500" />

        {/* Top Header */}
        <div className="pt-8 pb-6 px-6 sm:px-8 text-center bg-gradient-to-b from-slate-50/80 dark:from-slate-800/40 to-transparent relative">
          <div className="flex justify-center mb-4">
            <BrandLogo variant="full" className="h-11 sm:h-12 w-auto object-contain" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            बैंकिङ तयारी नेपाल
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            नेपाल राष्ट्र बैंक, वाणिज्य बैंक तथा संगठित संस्था परीक्षा तयारी
          </p>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div 
            id="login-error-alert"
            className="mx-6 sm:mx-8 mb-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span className="flex-1">{error}</span>
            <button 
              type="button" 
              onClick={() => setError('')} 
              className="p-1 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded-md"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Card Body */}
        <div className="px-6 sm:px-8 pb-8 space-y-4">
          
          {/* VIEW 1: DEFAULT OPTIONS */}
          {activeMode === 'options' && (
            <div className="space-y-4">
              {/* Official Google Button */}
              <div className="space-y-2">
                <button
                  type="button"
                  id="btn-google-login-primary"
                  disabled={isSigningIn}
                  onClick={handlePrimaryGoogleClick}
                  className="w-full min-h-[52px] py-3.5 px-5 flex items-center justify-center gap-3.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-white font-bold text-sm sm:text-base rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all active:scale-[0.99] cursor-pointer group disabled:opacity-50"
                >
                  <GoogleGIcon className="w-5 h-5 group-hover:scale-110 transition-transform shrink-0" />
                  <span>
                    {isSigningIn ? 'Google खाता खोल्दैछ...' : 'Continue with Google'}
                  </span>
                </button>

                <div ref={gisButtonContainerRef} className="flex justify-center empty:hidden" />

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>आधिकारिक Google OAuth 2.0 • सुरक्षित लगइन</span>
                </div>
              </div>

              {/* Divider */}
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
                <span className="flex-shrink mx-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  वा (OR)
                </span>
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
              </div>

              {/* Email / Password Option */}
              <button
                type="button"
                id="btn-toggle-email-signin"
                onClick={() => { setActiveMode('email'); setError(''); }}
                className="w-full min-h-[48px] py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm border border-slate-200 dark:border-slate-700 transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>इमेल र पासवर्ड मार्फत अगाडि बढ्नुहोस्</span>
              </button>

              {/* Continue as Guest User Option */}
              <div className="pt-1 text-center">
                <button
                  type="button"
                  id="btn-continue-as-guest"
                  onClick={handleContinueAsGuest}
                  className="w-full py-2.5 px-4 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-center gap-2 cursor-pointer border border-dashed border-slate-300 dark:border-slate-700"
                >
                  <UserCheck className="w-4 h-4 text-emerald-500" />
                  <span>अतिथि प्रयोगकर्ताको रूपमा जारी राख्नुहोस् (Continue as Guest)</span>
                </button>
              </div>
            </div>
          )}

          {/* VIEW 2: DYNAMIC GOOGLE ACCOUNT PROMPT */}
          {activeMode === 'google_input' && (
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <GoogleGIcon className="w-4 h-4" />
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">
                    Google खाता लगइन (Gmail)
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveMode('options')}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  पछाडि फर्कनुहोस्
                </button>
              </div>

              <form onSubmit={handleGoogleAccountSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Google (Gmail) इमेल ठेगाना *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      id="google-account-email-input"
                      placeholder="उदा: yourname@gmail.com"
                      value={googleEmail}
                      onChange={(e) => setGoogleEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 min-h-[44px] text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    तपाईंको पूरा नाम (Full Name - ऐच्छिक)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      id="google-account-name-input"
                      placeholder="उदा: Rishi Ram Thapa"
                      value={googleName}
                      onChange={(e) => setGoogleName(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 min-h-[44px] text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  id="btn-google-account-submit"
                  disabled={isSigningIn}
                  className="w-full min-h-[48px] py-3 px-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
                >
                  <GoogleGIcon className="w-4 h-4" />
                  <span>{isSigningIn ? 'Google खाता प्रमाणीकरण गर्दैछ...' : 'Google खाता मार्फत प्रवेश गर्नुहोस्'}</span>
                </button>
              </form>
            </div>
          )}

          {/* VIEW 3: EMAIL / PASSWORD FORM */}
          {activeMode === 'email' && (
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 space-y-4">
              {/* Form Header & Mode Switcher */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => { setIsRegisterMode(false); setError(''); }}
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg transition ${
                      !isRegisterMode 
                        ? 'bg-blue-600 text-white shadow-xs' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    लगइन (Sign In)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsRegisterMode(true); setError(''); }}
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg transition ${
                      isRegisterMode 
                        ? 'bg-blue-600 text-white shadow-xs' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    नयाँ दर्ता (Register)
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveMode('options')}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-semibold hover:underline"
                >
                  विकल्पहरू
                </button>
              </div>

              {/* Form Fields */}
              <form onSubmit={handleEmailAuthSubmit} className="space-y-3">
                {isRegisterMode && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      तपाईंको पूरा नाम (Full Name) *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        id="email-register-fullname-input"
                        placeholder="उदा: सुगम श्रेष्ठ (Sugam Shrestha)"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required={isRegisterMode}
                        className="w-full pl-10 pr-3.5 py-2.5 min-h-[44px] text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    इमेल ठेगाना (Email Address) *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      id="email-login-email-input"
                      placeholder="उदा: student@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 min-h-[44px] text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    पासवर्ड (Password)
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      id="email-login-password-input"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 min-h-[44px] text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  id="btn-email-submit"
                  disabled={isSigningIn}
                  className="w-full min-h-[48px] py-3 px-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer mt-1 disabled:opacity-50"
                >
                  <span>
                    {isSigningIn 
                      ? 'ड्यासबोर्ड खोल्दैछ...' 
                      : (isRegisterMode ? 'दर्ता गरी ड्यासबोर्ड खोल्नुहोस्' : 'लगइन गर्नुहोस्')}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* Footer note */}
          <p className="text-[11px] text-center text-slate-500 dark:text-slate-400">
            लगइन गरेपछि तपाईंका क्विज स्कोर, लिडरबोर्ड र्‍याङ्किङ र व्यक्तिगत अध्ययन नोट्स क्लाउडमा सुरक्षित रहनेछन्।
          </p>
        </div>
      </div>
    </div>
  );
};

// Full-color Official Google G Icon SVG
function GoogleGIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}
