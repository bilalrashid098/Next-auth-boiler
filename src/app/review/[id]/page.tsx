"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/page-header";
import { useParams } from "next/navigation";
import { EmbedPDF } from "@simplepdf/react-embed-pdf";
import { getUserData } from "@/utils/get-user";
import { Controller, useForm } from "react-hook-form";
import ReactSelect from "react-select";
import Button from "@/components/button";
import toast from "react-hot-toast";

const grades = [
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
  { label: "5", value: 5 },
];

const defaultValues = {
  comment: "",
  grade: 1,
};

export default function Home() {
  const user = getUserData();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [paper, setPaper] = useState({}) as any;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    reset,
    formState: { errors },
  }: any = useForm({
    defaultValues: defaultValues,
  });

  const getPaperDetail = async () => {
    const data = {
      userId: user?.id,
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
      if (response.data?.grade?.grade) {
        setValue("grade", response.data?.grade?.grade);
      }
      if (response.data?.grade?.comment) {
        setValue("comment", response.data?.grade?.comment);
      }
    }
  };

  const submitGradeAndComment = async (data: any) => {
    console.log(data);
    setIsLoading(true);
    data.userId = user.id;
    data.paperId = params.id;
    const response: any = await fetch("/api/submit-grade", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => res.json());
    if (response.status) {
      toast.success(response.message);
      setIsLoading(false);
      reset();
    } else {
      toast.error(response.message);
      setIsLoading(false);
      reset();
    }
  };

  useEffect(() => {
    getPaperDetail();
  }, [user]);

  return (
    <div className="py-3 px-4">
      <PageHeader title={"Paper Detail"} />
      {user?.role === "reviewer" ? (
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
            <form
              className="max-w-[400px]"
              onSubmit={handleSubmit(submitGradeAndComment)}
            >
              <div className="mb-3">
                <label
                  htmlFor="role"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Grade
                </label>
                <Controller
                  name="grade"
                  control={control}
                  rules={{
                    required: { value: true, message: "Grade is required" },
                  }}
                  render={({ field: { value } }) => (
                    <ReactSelect
                      className="customSelect"
                      value={grades.find((item: any) => item.value === value)}
                      onChange={(value: any) => {
                        setValue("grade", value.value);
                      }}
                      options={grades}
                    />
                  )}
                />
                {errors?.grade?.message && (
                  <span className="text-sm font-bold text-red-900">
                    {errors?.grade?.message}
                  </span>
                )}
              </div>
              <div className="mb-3">
                <label
                  htmlFor="comment"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Comment
                </label>
                <textarea
                  {...register("comment", {
                    required: { value: true, message: "Comment is required" },
                  })}
                  placeholder="Enter comment"
                  className="min-h-[150px] bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {errors?.comment?.message && (
                  <span className="text-sm font-bold text-red-900">
                    {errors?.comment?.message}
                  </span>
                )}
              </div>
              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full text-white bg-gray-700 hover:bg-gray-500 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Submit
              </Button>
            </form>
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
