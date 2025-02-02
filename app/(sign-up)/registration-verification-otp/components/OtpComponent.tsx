"use client";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { apiUrls } from "@/lib/config/apiUrls";
import { appUrls } from "@/lib/config/appUrls";
import { cn } from "@/lib/utils";
import { decryptData } from "@/utils/cryptoUtils";
import { usePostData } from "@/utils/useApiPost";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { signIn } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function OtpComponent() {
  const params = useParams();
  const router = useRouter();
  const decryptedData = decryptData(params?.id);

  const [otp, setOtp] = useState<string>("");
  const [remainingTime, setRemainingTime] = useState<number>(40);
  const { postData, isLoading } = usePostData();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Improved OTP change handler
  const handleOtpChange = useCallback((value: string) => {
    // Ensure only digits are entered
    const sanitizedValue = value.replace(/[^0-9]/g, "");
    setOtp(sanitizedValue);

    // Check if OTP is fully filled and trigger submission
    if (sanitizedValue.length === 6) {
      handleSubmit(sanitizedValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle OTP submission
  const handleSubmit = async (otpValue: string) => {
    if (decryptedData?.page === "login-verification") {
      try {
        const response = await postData(apiUrls.AUTH.LOGIN_OTP_VERIFICATION, {
          email: decryptedData?.email,
          otp: otpValue,
        });
        if (response?.status === 200) {
          // onVerificationSuccess?.();
          const result = await signIn("credentials", {
            redirect: false,
            accessToken: response?.data?.accessToken,
            refreshToken: response?.data?.refreshToken,
            userId: response?.data?.user?.id,
            email: response?.data?.user.email,
          });
          if (!result?.error) {
            toast.success("Signed in successfully! 😍😍😍", {
              position: "top-center",
            });
            router.push(appUrls.PROTECTED.DASHBOARD); // Redirect to the dashboard page
          } else {
            toast.error("Sign-in failed. Please try again", {
              position: "top-center",
            });
          }
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        const errorMessages = {
          401: "Invalid OTP",
          400: "User not found",
          default: error.message || "Server error",
        };
        const message =
          errorMessages[error?.status as keyof typeof errorMessages] ||
          errorMessages.default;
        setErrorMessage(message);

        toast.error(message, {
          position: "top-center",
        });
      }
    } else {
      try {
        const response = await postData(
          apiUrls.AUTH.REGISTER_OTP_VERIFICATION,
          {
            email: decryptedData,
            otp: otpValue,
          },
        );
        if (response?.status === 200) {
          // onVerificationSuccess?.();
          const result = await signIn("credentials", {
            redirect: false,
            accessToken: response?.data?.accessToken,
            refreshToken: response?.data?.refreshToken,
            userId: response?.data?.user?.id,
            email: response?.data?.user.email,
          });
          if (!result?.error) {
            toast.success("Signed in successfully! 😍😍😍", {
              position: "top-center",
            });
            router.push(appUrls.PROTECTED.DASHBOARD); // Redirect to the dashboard page
          } else {
            toast.error("Sign-in failed. Please try again", {
              position: "top-center",
            });
          }
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        const errorMessages = {
          401: "Invalid OTP",
          400: "User not found",
          default: error.message || "Server error",
        };
        const message =
          errorMessages[error?.status as keyof typeof errorMessages] ||
          errorMessages.default;
        setErrorMessage(message);

        toast.error(message, {
          position: "top-center",
        });
      }
    }
  };

  // Resend OTP timer logic
  useEffect(() => {
    const timer =
      remainingTime > 0 &&
      setTimeout(() => {
        setRemainingTime((prev) => prev - 1);
      }, 1000);

    return () => {
      if (timer) clearTimeout(timer);
    };
  });

  // Resend OTP handler
  const handleResendOtp = async () => {
    // Reset timer and trigger OTP resend logic
    setRemainingTime(40);
    // Add your resend OTP API call here
    try {
      const response = await postData(apiUrls.AUTH.GENERATE_NEW_REGISTER_OTP, {
        email: decryptedData,
      });

      if (response?.status === 201) {
        setErrorMessage(null);
        toast.success("New Opt has been send", {
          position: "top-center",
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessages = {
        default: error.message || "Server error",
      };
      console.error(error);
      toast.error(
        errorMessages[error?.status as keyof typeof errorMessages] ||
          errorMessages.default,
        {
          position: "top-center",
        },
      );
    }
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
              className={cn(
                errorMessage
                  ? "ml-[-1px] h-[4rem] w-[4rem] border-2 border-l-0 border-red-500 text-3xl transition-all duration-200 hover:border-primaryColor focus:border-primaryColor focus:outline-none focus:ring-2 focus:ring-primaryColor focus:ring-offset-2"
                  : "ml-[-1px] h-[4rem] w-[4rem] border-2 border-l-0 text-3xl transition-all duration-200 hover:border-primaryColor focus:border-primaryColor focus:outline-none focus:ring-2 focus:ring-primaryColor focus:ring-offset-2",
              )}
            />
          ))}
        </InputOTPGroup>
      </InputOTP>

      <div className="otp-resend mt-6">
        {remainingTime > 0 ? (
          <p className="font-geist_mono font-medium">
            Resent OTP in {remainingTime}s
          </p>
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
