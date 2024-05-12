"use client";

import Button from "@/components/button";
import { signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  return (
    <div>
      <h2>
        {" "}
        Welcome! {session?.user?.email}, {status}
      </h2>
      <Button onClick={() => signOut()}>Logout</Button>
    </div>
  );
}
