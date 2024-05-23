"use client";

import Sidebar from "@/components/sidebar";
import { AUTHENTICATED } from "@/constants";
import { useSession } from "next-auth/react";

export default function ThemeLayout({
  session,
  children,
}: {
  session: any;
  children: React.ReactNode;
}): React.ReactNode {
  const { status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full flex">
      {status === AUTHENTICATED && <Sidebar />}
      <div className={`${status === AUTHENTICATED ? "content" : "w-full"}`}>
        <div className="container">{children}</div>
      </div>
    </div>
  );
  //   return <div>{children}</div>;
}
