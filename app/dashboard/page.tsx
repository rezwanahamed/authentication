"use client";
import { Button } from "@/components/ui/button";
import { loreleiNeutral } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import Image from "next/image";
import { useEffect, useState } from "react";
import DashboardQrDialog from "./QrDialog";

const RandomAvatar = ({
  seed,
}: {
  seed?: number | string; // Make seed optional
}) => {
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    const generateAvatar = async () => {
      try {
        // Use the provided seed or generate a random one if not provided
        const avatarSeed =
          seed !== undefined
            ? seed
            : Math.random().toString(36).substring(2, 15);

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
  }, [seed]); // Add size and seed to the dependency array

  return (
    <div className="main-wrapper mx-auto flex max-h-max min-h-screen w-[25rem] items-center justify-center">
      <div className="user-details">
        <div className="flex items-center gap-2">
          <Image
            src={avatarUrl}
            alt="Random Avatar"
            className="h-12 w-12 rounded-full"
            width={500}
            height={500}
          />
          <DashboardQrDialog />
        </div>
        <div className="user-details mt-4 space-y-1 font-geist_mono">
          <div className="name">Rezwan Ahamed</div>
          <div className="email">rezwanahamed85@gmail.com</div>
          <div className="age">22</div>
          <div className="date-of-birth">04-06-2002</div>
          <div className="phone">+8801725282740</div>
          <div className="location">Block-2/405, Liverpool, UK</div>
          <div className="type">User</div>
        </div>
        <Button className="mt-4 border border-red-600 bg-red-600 font-geist_mono text-white duration-300 hover:bg-transparent hover:text-red-600">
          Logout
        </Button>
      </div>
    </div>
  );
};

export default RandomAvatar;
