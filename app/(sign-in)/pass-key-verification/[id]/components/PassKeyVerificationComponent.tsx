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
import { signIn } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export function PasskeyVerificationComponent() {
  const params = useParams();
  const router = useRouter();
  const decryptedEmail = decryptData(params?.id as string);

  const [otp, setOtp] = useState<string>("");
  const { postData } = usePostData();
  const [errorMessage, setErrorMessage] = useState<string | null>();

  // Updated OTP change handler to allow all characters
  const handleOtpChange = useCallback((value: string) => {
    // Accept all characters except spaces
    const sanitizedValue = value.replace(/\s/g, "");
    setOtp(sanitizedValue);

    // Check if OTP is fully filled and trigger submission
    if (sanitizedValue.length === 10) {
      handleSubmit(sanitizedValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle OTP submission
  const handleSubmit = async (otpValue: string) => {
    try {
      const response = await postData(apiUrls.AUTH.LOGIN_IN_VIA_PASSKEY, {
        email: decryptedEmail,
        passkey: otpValue,
      });
      if (response?.status === 200) {
        const result = await signIn("credentials", {
          redirect: false,
          accessToken: response?.data?.accessToken,
          refreshToken: response?.data?.refreshToken,
          userId: response?.data?.user?.id,
          email: response?.data?.user.email,
        });
        if (!result?.error) {
          toast.success("Log in successfully", {
            position: "top-center",
          });
          router.push(appUrls.PROTECTED.DASHBOARD);
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

      setErrorMessage(
        errorMessages[error?.status as keyof typeof errorMessages] ||
          errorMessages.default,
      );
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
        maxLength={10}
        value={otp}
        onChange={handleOtpChange}
        pattern=".*"
      >
        <InputOTPGroup className="grid grid-cols-10 font-geist_mono">
          {Array.from({ length: 10 }).map((_, index) => (
            <InputOTPSlot
              key={index}
              index={index}
              className={cn(
                errorMessage
                  ? "ml-[-1px] h-[3.5rem] w-[3.5rem] border-2 border-l-0 border-red-500 text-3xl transition-all duration-200 hover:border-primaryColor focus:border-primaryColor focus:outline-none focus:ring-2 focus:ring-primaryColor focus:ring-offset-2"
                  : "ml-[-1px] h-[3.5rem] w-[3.5rem] border-2 border-l-0 text-3xl transition-all duration-200 hover:border-primaryColor focus:border-primaryColor focus:outline-none focus:ring-2 focus:ring-primaryColor focus:ring-offset-2",
              )}
            />
          ))}
        </InputOTPGroup>
      </InputOTP>
    </>
  );
}
