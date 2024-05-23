"use client";

import PageHeader from "@/components/page-header";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  return (
    <div className="py-3 px-4">
      <PageHeader title={"Home"} />
      <h2 className="text-lg"> Welcome! {session?.user?.name}</h2>
    </div>
  );
}
