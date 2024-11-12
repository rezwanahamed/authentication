"use client";
import { Button } from "@/components/ui/button";
import { fetchData } from "@/lib/utils/useApiGet";
import { IPasskey, IUserPassKeysResponse } from "@/types/interface";
import { Sticker } from "lucide-react";
import { useEffect, useState } from "react";
import QrDialog from "./QrDialog";

const Homepage = () => {
  const [userData, setUserData] = useState<IUserPassKeysResponse>();

  useEffect(() => {
    const fetchedData = async () => {
      try {
        const response = await fetchData("/api/authorize-user//user-passkey");
        setUserData(response);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchedData();
  }, []);

  console.warn("******************* ", userData);

  return (
    <div className="main-wrapper mx-auto flex max-h-max min-h-screen w-[25rem] items-center justify-center">
      <div className="wrapper space-y-6">
        <div className="logo flex h-12 w-12 items-center justify-center rounded-lg bg-[#233856]">
          <Sticker className="h-6 w-6 text-blue-500" />
        </div>
        <div className="descriptions space-y-2">
          <h2 className="font-geist text-xl font-medium">
            Your account recovery derails
          </h2>
          <p className="w-full font-geist text-sm font-medium text-gray-400">
            Pease do not share your account credentials with others. Use passkey
            to recover your account.
          </p>
        </div>

        <div className="account-details-credentials">
          <div className="pass-key">
            <h2 className="font-geist">Passkeys </h2>
            <ul className="mt-2 space-y-1 font-geist_mono">
              {userData?.passkeys?.map((passkey, index) => (
                <li key={index}>{passkey?.passkey}</li>
              ))}
            </ul>
            <div className="button-group mt-4 flex items-center gap-3">
              <Button className="bg-blue-500 font-geist_mono">
                Copy passkey
              </Button>
              <QrDialog passkeys={userData?.passkeys as IPasskey[]} />
            </div>
          </div>
        </div>
        <div className="wrapper space-y-4 pt-4">
          <div className="recovery-email">
            <p className="font-geist">Account email address</p>
            <span className="font-geist_mono text-gray-400">
              {userData?.user?.email}
            </span>
          </div>
          <div className="recovery-phone">
            <p className="font-geist">Recovery phone number</p>
            <span className="font-geist_mono text-gray-400">
              {userData?.user?.phone}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
