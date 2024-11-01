"use client";
import { decryptData } from "@/lib/utils/cryptoUtils";
import { usePostData } from "@/lib/utils/useApiPost";
import { Asterisk } from "lucide-react";
import { useEffect } from "react";
import Cookies from "universal-cookie";
import { OtpComponent } from "./components/OtpComponent";

const Homepage = () => {
  const { postData } = usePostData();
  const cookies = new Cookies();

  useEffect(() => {
    const cookiesEncryptedValue = cookies.get("register_status");
    if (cookiesEncryptedValue) {
      const cookiesDecryptedData = decryptData(cookiesEncryptedValue as string);
      console.warn(cookiesDecryptedData);
      postData("/api/auth/send-email", {});
    }
  }, []);

  return (
    <div className="main-wrapper mx-auto flex max-h-max min-h-screen w-[25rem] items-center justify-center">
      <div className="wrapper space-y-6">
        <div className="logo flex h-12 w-12 items-center justify-center rounded-lg bg-[#233856]">
          <Asterisk className="h-6 w-6 text-blue-500" />
        </div>
        <div className="descriptions space-y-2">
          <h2 className="font-geist text-xl font-medium">
            Register to your profile
          </h2>
          <p className="w-full font-geist text-sm font-medium text-gray-400">
            Provide your valid details in the registration form. We will send a
            verification code in your email address.
          </p>
        </div>

        <div className="form-wrapper">
          {/* <CommonFormComponent/> */}
          <OtpComponent />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
