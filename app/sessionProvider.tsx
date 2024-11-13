"use client";

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

interface ProvidersProps {
  children: React.ReactNode;
  session?: Session | null; // Make session optional
}

export default function Providers({ children, session }: ProvidersProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
