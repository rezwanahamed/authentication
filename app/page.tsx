"use client";
import { Button } from "@/components/ui/button";
import { ShieldPlus } from "lucide-react";
import Link from "next/link";

const Homepage = () => {
  return (
    <div className="main-wrapper mx-auto flex max-h-max min-h-screen w-[25rem] items-center justify-center">
      <div className="wrapper flex w-full flex-col items-center justify-center space-y-6">
        <div className="logo flex h-12 w-12 items-center justify-center rounded-lg bg-[#233856]">
          <ShieldPlus className="h-6 w-6 text-blue-500" />
        </div>
        <div className="details">
          <h1 className="text-center font-geist text-lg font-medium text-white">
            Welcome to the authentication project.
          </h1>
          <p className="mt-2 text-center font-geist_mono text-sm text-gray-400">
            Check out the demo of authentication and read the authentication
            demo the get detail context on how the process works.
          </p>
        </div>
        <div className="button-group flex gap-4 pt-4">
          <a
            href="https://protfolio2024.vercel.app/projects/opensource"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="rounded-full bg-blue-500 p-6 font-geist_mono">
              Read doc
            </Button>
          </a>
          <Link href={"/register"}>
            <Button className="rounded-full bg-white p-6 font-geist_mono font-semibold text-black hover:text-white">
              Try it out
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
