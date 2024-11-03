"use client";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { usePostData } from "@/lib/utils/useApiPost";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import React, { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useParams } from 'next/navigation'
import { decryptData, encryptData } from "@/lib/utils/cryptoUtils";

interface OtpComponentProps {
  email?: string;
  onVerificationSuccess?: () => void;
}

export function OtpComponent({ email, onVerificationSuccess }: OtpComponentProps) {
  const params = useParams()
  const decryptedEmail = decryptData(params?.id as string)

  const [otp, setOtp] = useState<string>("");
  const [remainingTime, setRemainingTime] = useState<number>(40);
  const { postData, isLoading } = usePostData();

  // Improved OTP change handler
  const handleOtpChange = useCallback((value: string) => {
    // Ensure only digits are entered
    const sanitizedValue = value.replace(/[^0-9]/g, '');
    setOtp(sanitizedValue);

    // Check if OTP is fully filled and trigger submission
    if (sanitizedValue.length === 6) {
      handleSubmit(sanitizedValue);
    }
  }, []);

  // Handle OTP submission
  const handleSubmit = async (otpValue: string) => {
    try {
      const response = await postData("/api/auth/register-otp-verification", {
        email: decryptedEmail,
        otp: otpValue,
      });

      if (response?.status === 200) {
        toast.success("OTP verification successful", {
          position: "top-center",
        });
        onVerificationSuccess?.();
      }
    } catch (error: any) {
      const errorMessages = {
        401: "Invalid OTP",
        400: "User not found",
        default: error.message || "Server error"
      };

      toast.error(errorMessages[error?.status as keyof typeof errorMessages] || errorMessages.default, { 
        position: "top-center" 
      });
    }
  };

  // Resend OTP timer logic
  useEffect(() => {
    const timer = remainingTime > 0 && setTimeout(() => {
      setRemainingTime(prev => prev - 1);
    }, 1000);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [remainingTime]);

  // Resend OTP handler
  const handleResendOtp = () => {
    // Reset timer and trigger OTP resend logic
    setRemainingTime(40);
    // Add your resend OTP API call here
  };

  return (
    <>
      <InputOTP 
        maxLength={6} 
        pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
        value={otp}
        onChange={handleOtpChange}
      >
        <InputOTPGroup className="grid grid-cols-6 font-geist_mono">
          {Array.from({ length: 6 }).map((_, index) => (
            <InputOTPSlot
              key={index}
              index={index}
              className="h-[4rem] w-[4rem] border-gray-400 text-3xl focus:border-blue-500 focus:outline-none"
            />
          ))}
        </InputOTPGroup>
      </InputOTP>

      <div className="otp-resend mt-6">
        {remainingTime > 0 ? (
          <p className="font-geist_mono font-medium">Resent OTP in {remainingTime}s</p>
        ) : (
          <button 
            onClick={handleResendOtp}
            className="font-geist_mono font-medium text-blue-500 hover:underline"
            disabled={isLoading}
          >
            Resend OTP
          </button>
        )}
      </div>
    </>
  );
}