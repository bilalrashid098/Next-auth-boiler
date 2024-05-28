"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/page-header";
import { useParams } from "next/navigation";
import { EmbedPDF } from "@simplepdf/react-embed-pdf";
import { getUserData } from "@/utils/get-user";
import { Controller } from "react-hook-form";
import ReactSelect from "react-select";
import Button from "@/components/button";
import toast from "react-hot-toast";

export default function Home() {
  const user = getUserData();
  const params = useParams();
  const [paper, setPaper] = useState({}) as any;
  const [reviewers, setReviewers] = useState([]) as any;
  const [isLoading, setIsLoading] = useState(false);

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

  const getReviewers = async (track: string) => {
    const data = {
      userId: user?.id,
      track,
    };
    const response: any = await fetch("/api/get-track-reviewers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => res.json());
    if (response.status) {
      setReviewers(response.data);
    }
  };

  const handleReviewer = (value: any) => {
    const updateReviewer = value.map((item: any) => item.value);
    const updatedPaper = { ...paper, reviewerId: updateReviewer };
    console.log(updatedPaper);
    setPaper(updatedPaper);
  };

  const updatePaper = async () => {
    setIsLoading(true);
    const response: any = await fetch("/api/update-paper", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paper),
    }).then((res) => res.json());
    if (response.status) {
      setIsLoading(false);
      toast.success("Paper updated successfully");
    }
  };

  useEffect(() => {
    getPaperDetail();
  }, []);

  useEffect(() => {
    if (paper?.track) {
      getReviewers(paper?.track);
    }
  }, [paper]);

  return (
    <div className="py-3 px-4">
      <PageHeader title={"Paper Detail"} />
      {user?.role === "admin" ? (
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
          <div className="mb-3 w-full flex">
            <label className="min-w-[100px] mt-3" htmlFor="">
              Reviewer:{" "}
            </label>
            <div className="md:max-w-[350px] w-full">
              <ReactSelect
                className="customSelect w-full"
                isMulti
                value={reviewers.filter((item: any) =>
                  paper.reviewerId?.includes(item.value)
                )}
                onChange={(value: any) => {
                  handleReviewer(value);
                }}
                options={reviewers}
              />
              <Button
                isLoading={isLoading}
                className="mt-2"
                onClick={updatePaper}
              >
                Select
              </Button>
            </div>
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
