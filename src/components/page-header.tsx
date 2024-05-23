"use client";

import { useSession } from "next-auth/react";

export default function PageHeader(props: any) {
  const { title } = props;
  return (
    <div className="flex py-3 mb-4">
      <h2 className="text-xl">{title}</h2>
    </div>
  );
}
