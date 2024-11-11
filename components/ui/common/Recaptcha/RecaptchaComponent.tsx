import React, { useEffect, useCallback } from 'react';

// Define types for the window object with grecaptcha
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
      render: (element: HTMLElement, options: ReCAPTCHAOptions) => number;
    };
  }
}

// Define types for reCAPTCHA options
interface ReCAPTCHAOptions {
  sitekey: string;
  size?: 'invisible' | 'normal' | 'compact';
  theme?: 'light' | 'dark';
  callback?: (token: string) => void;
  'expired-callback'?: () => void;
  'error-callback'?: () => void;
}

// Define props interface for the component
interface ReCAPTCHAProps {
  siteKey: string;
  onVerify: (token: string) => void;
  action?: string;
  theme?: 'light' | 'dark';
  size?: 'invisible' | 'normal' | 'compact';
  onError?: (error: Error) => void;
  onExpired?: () => void;
}

const ReCAPTCHA: React.FC<ReCAPTCHAProps> = ({
  siteKey,
  onVerify,
  action = 'submit',
  theme = 'light',
  size = 'invisible',
  onError,
  onExpired,
}) => {
  // Initialize reCAPTCHA when component mounts
  const initializeReCAPTCHA = useCallback((): void => {
    if (typeof window !== 'undefined' && !window.grecaptcha) {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, [siteKey]);

  useEffect(() => {
    initializeReCAPTCHA();
  }, [initializeReCAPTCHA]);

  // Handle reCAPTCHA verification
  const handleReCAPTCHAVerification = useCallback((): void => {
    if (window.grecaptcha) {
      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute(siteKey, { action })
          .then((token: string) => {
            onVerify(token);
          })
          .catch((error: Error) => {
            console.error('reCAPTCHA error:', error);
            onError?.(error);
          });
      });
    }
  }, [siteKey, onVerify, action, onError]);

  return (
    <div 
      className="g-recaptcha" 
      data-sitekey={siteKey}
      data-theme={theme}
      data-size={size}
    >
      <input
        type="hidden"
        name="g-recaptcha-response"
        id="g-recaptcha-response"
      />
    </div>
  );
};

export default ReCAPTCHA;