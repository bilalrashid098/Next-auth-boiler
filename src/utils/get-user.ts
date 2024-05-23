"use client";

import { useSession } from "next-auth/react";

export const getUserData = () => {
  const { data: session }: any = useSession();
  return session?.user.data;
};
