'use client';

import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';

// Wrapper component to handle Google OAuth provider
export default function GoogleLoginWrapper() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return null;
  }
  
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
      <GoogleLoginButton />
    </GoogleOAuthProvider>
  );
}

function GoogleLoginButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) {
      toast.error('No credential received from Google');
      return;
    }
    
    setIsLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://hoe-be.onrender.com';
      const response = await fetch(`${baseUrl}/api/auth/google-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: credentialResponse.credential
        })
      });
      
      if (!response.ok) {
        // Try to parse JSON error, but guard against HTML responses
        let message = 'Login failed';
        try {
          const contentType = response.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const errorData = await response.json();
            message = errorData.message || message;
          } else {
            const text = await response.text();
            if (text) message = text.slice(0, 200);
          }
        } catch {}
        throw new Error(message);
      }

      const data = await response.json();
  
      // Store authentication data
      localStorage.setItem('token', data.token);
      
      // Store user data with correct field mapping
      const userData = {
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.name?.split(' ')[0] || data.user.firstName || '',
        lastName: data.user.name?.split(' ').slice(1).join(' ') || data.user.lastName || '',
        phone: data.user.phone || '',
        dateOfBirth: data.user.dateOfBirth || '',
        avatar: data.user.avatar || '',
        token: data.token,
        addresses: data.user.addresses || [],
        preferences: data.user.preferences || {
          emailNotifications: true,
          smsNotifications: false,
          marketingEmails: false,
          currency: 'INR',
          language: 'en'
        },
        createdAt: data.user.createdAt || new Date().toISOString(),
        updatedAt: data.user.updatedAt || new Date().toISOString()
      };
      
      localStorage.setItem('user', JSON.stringify(userData));

      // Inform global auth context immediately so UI updates without reload
      signIn(userData, data.token);
  
      toast.success('Login successful!');
      router.push('/');
      router.refresh();
      
    } catch (error) {
      console.error('Google login error:', error);
      toast.error((error as Error).message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleGoogleError = () => {
    toast.error('Google login failed. Please try again.');
  };

  return (
    <div className="w-full flex justify-center">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        shape="rectangular"
        theme="outline"
        size="large"
        text="signin_with"
        locale="en"
        useOneTap={false} // Disable One Tap as it can cause issues
        auto_select={false}
      />
    </div>
  );
}
