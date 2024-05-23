"use client";

import PageHeader from "@/components/page-header";
import Button from "@/components/button";
import { routes } from "@/constants";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ReactSelect from "react-select";
import FileInput from "@/components/file-input";
import { getUserData } from "@/utils/get-user";

const defaultValues = {
  title: "",
  track: "internetTechnologies",
  file: "",
};

const optionsTrack = [
  { value: "internetTechnologies", label: "Internet technologies" },
  { value: "SoftwareAgents", label: "Software Agents" },
  { value: "eGovernment", label: "E-Government" },
  { value: "medicine2", label: "Medicine 2.0" },
  { value: "bioinformatics", label: "Bioinformatics" },
];

export default function Create() {
  const user = getUserData();
  const [isLoading, setIsLoading] = useState(false);
  const [isReset, setIsReset] = useState(false);
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
  const handleSignIn = async (data: any) => {
    setIsLoading(true);
    if (!data.file) {
      toast.error("Please upload a file");
      return;
    }
    data.userId = user.id;
    const response: any = await fetch("/api/submit-paper", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => res.json());
    if (response.status) {
      toast.success(response.message);
      setIsLoading(false);
      setIsReset(true);
      reset();
    } else {
      toast.error(response.message);
      setIsLoading(false);
      setIsReset(true);
      reset();
    }
  };
  return (
    <div className="py-3 px-4">
      <PageHeader title={"Create"} />
      <div className="max-w-[500px]">
        <div>
          <h2 className="text-lg">Add a new paper</h2>
          <p className="mb-5">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ea ipsa
            magni sed molestiae architecto iste praesentium delectus libero
            repellat. Ipsum vel nobis ab accusamus, soluta suscipit nihil neque
            ea laudantium
          </p>
        </div>
        <form
          className="space-y-4 md:space-y-6"
          onSubmit={handleSubmit(handleSignIn)}
        >
          <div>
            <label
              htmlFor="title"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Title
            </label>
            <input
              {...register("title", {
                required: { value: true, message: "Title is required" },
              })}
              type="text"
              placeholder="Enter paper title"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            {errors?.title?.message && (
              <span className="text-sm font-bold text-red-900">
                {errors?.title?.message}
              </span>
            )}
          </div>

          <div>
            <label
              htmlFor="role"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Track
            </label>
            <Controller
              name="track"
              control={control}
              rules={{
                required: { value: true, message: "Track is required" },
              }}
              render={({ field: { value } }) => (
                <ReactSelect
                  className="customSelect"
                  value={optionsTrack.find((item) => item.value === value)}
                  onChange={(value: any) => {
                    setValue("track", value.value);
                  }}
                  options={optionsTrack}
                />
              )}
            />
            {errors?.track?.message && (
              <span className="text-sm font-bold text-red-900">
                {errors?.track?.message}
              </span>
            )}
          </div>

          <div>
            <label
              htmlFor="role"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Upload paper
            </label>
            <FileInput
              isReset={isReset}
              setIsReset={setIsReset}
              setValue={setValue}
              getValues={getValues}
            />
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
    </div>
  );
}
