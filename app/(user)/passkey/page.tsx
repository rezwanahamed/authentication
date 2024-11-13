"use client";
import { Button } from "@/components/ui/button";
import { IPasskey, IUserPassKeysResponse } from "@/types/interface";
import { fetchData } from "@/utils/useApiGet";
import { Copy, RotateCw, Sticker } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import QrDialog from "./QrDialog";

const PasskeyPage = () => {
  const [userData, setUserData] = useState<IUserPassKeysResponse>();
  const [passkeys, setPasskeys] = useState<IPasskey[]>([]);

  useEffect(() => {
    const fetchedData = async () => {
      try {
        const response = await fetchData("/api/authorize-user/user-passkey");
        setUserData(response);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchedData();
  }, [passkeys, userData]);

  const handleGeneratePasskeys = async () => {
    try {
      const response = await fetchData(
        "/api/authorize-user/generate-new-passkeys",
      );
      if (response) {
        toast.success("New passkeys generated", {
          position: "top-center",
        });
        setPasskeys(response);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleCopyPasskeys = () => {
    const passkeysToDisplay =
      passkeys.length > 0
        ? passkeys.map((pk) => pk.passkey).join("\n")
        : userData?.passkeys?.map((pk) => pk.passkey).join("\n");

    if (passkeysToDisplay) {
      navigator.clipboard
        .writeText(passkeysToDisplay)
        .then(() => {
          toast.success("Passkeys copied to clipboard", {
            position: "top-center",
          });
        })
        .catch((error) => {
          console.error("Failed to copy passkeys:", error);
          toast.error("Failed to copy passkeys", {
            position: "top-center",
          });
        });
    }
  };

  return (
    <div className="main-wrapper mx-auto flex max-h-max min-h-screen w-[25rem] items-center justify-center">
      <div className="wrapper space-y-6">
        <div className="logo flex h-12 w-12 items-center justify-center rounded-lg bg-[#233856]">
          <Sticker className="h-6 w-6 text-blue-500" />
        </div>
        <div className="descriptions space-y-2">
          <h2 className="font-geist text-xl font-medium">
            Your account recovery details
          </h2>
          <p className="w-full font-geist text-sm font-medium text-gray-400">
            Please do not share your account credentials with others. Use
            passkey to recover your account.
          </p>
        </div>

        <div className="account-details-credentials">
          <div className="pass-key">
            <h2 className="font-geist">Passkeys </h2>
            <ul className="mt-2 space-y-1 font-geist_mono">
              {passkeys && passkeys.length > 0
                ? passkeys.map((passkey, index) => (
                    <li key={index}>{passkey?.passkey}</li>
                  ))
                : userData?.passkeys?.map((passkey, index) => (
                    <li key={index}>{passkey?.passkey}</li>
                  ))}
            </ul>
            <div className="button-group mt-4 flex items-center gap-3">
              <Button
                onClick={handleCopyPasskeys}
                className="flex items-center gap-2 bg-blue-500 font-geist_mono"
              >
                <Copy className="h-4 w-4" />
                Copy passkey
              </Button>
              <QrDialog passkeys={userData?.passkeys as IPasskey[]} />
              <button
                onClick={() => handleGeneratePasskeys()}
                className="qr-button flex h-10 justify-center rounded bg-[#233856] p-2 text-blue-500"
              >
                <RotateCw />
              </button>
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

export default PasskeyPage;
