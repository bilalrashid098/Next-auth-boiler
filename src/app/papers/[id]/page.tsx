"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/page-header";
import { useParams } from "next/navigation";
import { EmbedPDF } from "@simplepdf/react-embed-pdf";
import { getUserData } from "@/utils/get-user";

export default function Home() {
  const user = getUserData();
  const params = useParams();
  const [paper, setPaper] = useState({}) as any;

  const getPaperDetail = async () => {
    const data = {
      paperId: params?.id,
    };
    const response: any = await fetch("/api/get-paper-detail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => res.json());
    if (response.status) {
      setPaper(response.data);
    }
  };

  useEffect(() => {
    getPaperDetail();
  }, []);

  return (
    <div className="py-3 px-4">
      <PageHeader title={"Paper Detail"} />
      {user?.role === "author" ? (
        <div>
          <div className="mb-3">
            <label className="min-w-[100px]" htmlFor="">
              Title:{" "}
            </label>
            {paper?.title}
          </div>
          <div className="mb-3">
            <label className="min-w-[100px]" htmlFor="">
              Track:{" "}
            </label>
            {paper?.track}
          </div>
          <div className="mb-3">
            <label className="min-w-[100px]" htmlFor="">
              Grade:{" "}
            </label>
            {paper?.avgGrade ? paper?.avgGrade : "NA"}
          </div>
          <div className="mb-3">Paper</div>
          {paper?.file ? (
            <EmbedPDF
              mode="inline"
              style={{ width: 700, height: 600 }}
              documentURL={paper?.file}
            />
          ) : (
            "Loading..."
          )}
        </div>
      ) : (
        <div>You are not allowed to access this page</div>
      )}
    </div>
  );
}
