"use client";
import { OtpComponent } from "@/app/registration-verification-otp/components/OtpComponent";
import { Asterisk } from "lucide-react";


const Homepage = () => {
  return (
    <div className="main-wrapper mx-auto flex max-h-max min-h-screen w-[25rem] items-center justify-center">
      <div className="wrapper space-y-6">
        <div className="logo flex h-12 w-12 items-center justify-center rounded-lg bg-[#233856]">
          <Asterisk className="h-6 w-6 text-blue-500" />
        </div>
        <div className="descriptions space-y-2">
          <h2 className="font-geist text-xl font-medium">
            Login to your profile
          </h2>
          <p className="w-full font-geist text-sm font-medium text-gray-400">
            Provide your valid details in the registration form. We will send a
            verification code in your email address.
          </p>
        </div>

        <div className="form-wrapper">
          <OtpComponent />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
