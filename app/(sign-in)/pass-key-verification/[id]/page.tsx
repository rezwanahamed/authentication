"use client";
import { Key } from "lucide-react";
import { PasskeyVerificationComponent } from "./components/PassKeyVerificationComponent";

const passkeyVerificationPage = () => {
  return (
    <div className="main-wrapper mx-auto flex max-h-max min-h-screen w-[35rem] items-center justify-center">
      <div className="wrapper space-y-6">
        <div className="logo flex h-12 w-12 items-center justify-center rounded-lg bg-[#233856]">
          <Key className="h-6 w-6 text-blue-500" />
        </div>
        <div className="descriptions space-y-2">
          <h2 className="font-geist text-xl font-medium">Login with passkey</h2>
          <p className="w-[80%] font-geist text-sm font-medium text-gray-400">
            Use your passkey to login. You can use the passkey one time for
            login.
          </p>
        </div>

        <div className="form-wrapper">
          <PasskeyVerificationComponent />
        </div>
      </div>
    </div>
  );
};

export default passkeyVerificationPage;
