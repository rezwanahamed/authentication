"use client";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export function OtpComponent() {
  return (
    <>
      <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS}>
        <InputOTPGroup className="grid grid-cols-6 font-geist_mono">
          <InputOTPSlot
            className="h-[4rem] w-[4rem] border-gray-400 text-3xl focus:border-blue-500 focus:outline-none"
            index={0}
          />
          <InputOTPSlot
            className="h-[4rem] w-[4rem] border-gray-400 text-3xl focus:border-blue-500 focus:outline-none"
            index={1}
          />
          <InputOTPSlot
            className="h-[4rem] w-[4rem] border-gray-400 text-3xl focus:border-blue-500 focus:outline-none"
            index={2}
          />
          <InputOTPSlot
            className="h-[4rem] w-[4rem] border-gray-400 text-3xl focus:border-blue-500 focus:outline-none"
            index={3}
          />
          <InputOTPSlot
            className="h-[4rem] w-[4rem] border-gray-400 text-3xl focus:border-blue-500 focus:outline-none"
            index={4}
          />
          <InputOTPSlot
            className="h-[4rem] w-[4rem] border-gray-400 text-3xl focus:border-blue-500 focus:outline-none"
            index={5}
          />
        </InputOTPGroup>
      </InputOTP>

      <div className="otp-resend mt-6">
        <p className="font-geist_mono font-medium">
          Resent OTP in 40s
        </p>
      </div>
    </>
  );
}
