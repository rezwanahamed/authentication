"use client";
import { apiUrls } from "@/lib/config/apiUrls";
import { IFetchUserData } from "@/types/interface";
import { fetchData } from "@/utils/useApiGet";
import { loreleiNeutral } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { Castle, Cat, Flower2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

const RandomAvatar = () => {
  const [avatarUrl, setAvatarUrl] = useState("");
  const [userData, setUserData] = useState<IFetchUserData>();

  useEffect(() => {
    const fetchedData = async () => {
      try {
        const response = await fetchData(apiUrls.PROTECTED.USER_DETAILS);
        setUserData(response);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchedData();
  }, []);

  useEffect(() => {
    const generateAvatar = async () => {
      try {
        // Use the provided seed or generate a random one if not provided
        const avatarSeed = userData?._id;

        const avatar = createAvatar(loreleiNeutral, {
          seed: avatarSeed as string,
          backgroundColor: ["ffffff"],
          backgroundType: ["gradientLinear", "solid"],
        });

        const svg = await avatar.toString();
        const dataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
        setAvatarUrl(dataUri);
      } catch (error) {
        console.error("Error generating avatar:", error);
      }
    };

    generateAvatar();
  }, [userData]); // Add size and seed to the dependency array

  return (
    <div className="bg-black">
      <div className="main-wrapper mx-auto flex max-h-max min-h-screen w-[25rem] items-center justify-center">
        <div className="details-card w-[20rem] rounded border-2 border-white bg-black">
          <div className="top-details border-b-2 px-5 py-3">
            <div className="avatar flex items-center justify-between">
              <Image
                src={avatarUrl}
                width={500}
                height={500}
                quality={100}
                className="h-10 w-10 rounded-full"
                alt="avatar"
              />
              <div className="name font-geist_mono font-medium">
                {userData?.firstName} {userData?.lastName}
              </div>
            </div>
          </div>
          <div className="qr-holder border-b-2 p-6">
            <QRCode
              size={256}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={`${userData?.firstName} ${userData?.lastName} ${userData?.email} ${userData?._id}`}
              viewBox={`0 0 256 256`}
            />
          </div>
          <div className="additional-details border-b-2 px-5">
            <div className="user-type flex justify-between">
              <h2 className="w-[50%] border-r-2 py-3 font-geist_mono font-bold">
                Elite class
              </h2>
              <div className="icons-details flex justify-center py-3">
                <Flower2 />
              </div>
            </div>
          </div>
          <div className="additional-details border-b-2 px-5">
            <div className="icons-details flex items-center gap-2 py-3 font-geist_mono font-bold">
              <Castle /> Reeves family
            </div>
          </div>
          <div className="additional-details px-5">
            <div className="icons-details flex items-center gap-2 py-3 font-geist_mono font-bold">
              <Cat /> colossal titan
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RandomAvatar;
