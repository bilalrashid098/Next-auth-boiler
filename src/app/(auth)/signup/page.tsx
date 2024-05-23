"use client";

import Button from "@/components/button";
import { routes } from "@/constants";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ReactSelect from "react-select";

const defaultValues = {
  name: "",
  email: "",
  password: "",
  role: "author",
  track: "internetTechnologies",
};

const options = [
  { value: "author", label: "Author" },
  { value: "reviewer", label: "Reviewer" },
];

const optionsTrack = [
  { value: "internetTechnologies", label: "Internet technologies" },
  { value: "SoftwareAgents", label: "Software Agents" },
  { value: "eGovernment", label: "E-Government" },
  { value: "medicine2", label: "Medicine 2.0" },
  { value: "bioinformatics", label: "Bioinformatics" },
];

export default function SignUp() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  }: any = useForm({
    defaultValues: defaultValues,
  });
  const handleSignIn = async (data: any) => {
    setIsLoading(true);
    const response: any = await fetch("/api/create-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => res.json());
    if (response.status) {
      const res: any = await signIn("credentials", {
        ...data,
        redirect: false,
      });
      if (res?.ok) {
        setIsLoading(false);
        router.push(routes.home);
      }
    } else {
      setIsLoading(false);
    }
  };

  return (
    <section className="">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <Link
          href="#"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <Image
            className="w-8 h-8 mr-2"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="logo"
            width={100}
            height={100}
          />
          Flowbite
        </Link>
        <div className="w-full rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign up to your account
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleSubmit(handleSignIn)}
            >
              <div>
                <label
                  htmlFor="role"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Role
                </label>
                <Controller
                  name="role"
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { value } }) => (
                    <ReactSelect
                      className="customSelect"
                      value={options.find((item) => item.value === value)}
                      onChange={(value: any) => {
                        setValue("role", value.value);
                      }}
                      options={options}
                    />
                  )}
                />
              </div>

              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Name
                </label>
                <input
                  {...register("name", {
                    required: { value: true, message: "Name is required" },
                  })}
                  placeholder="Enter you name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {errors?.name?.message && (
                  <span className="text-sm font-bold text-red-900">
                    {errors?.name?.message}
                  </span>
                )}
              </div>

              {watch("role") === "reviewer" && (
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
                        value={optionsTrack.find(
                          (item) => item.value === value
                        )}
                        onChange={(value: any) => {
                          setValue("track", value);
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
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email
                </label>
                <input
                  {...register("email", {
                    required: { value: true, message: "Email is required" },
                  })}
                  type="email"
                  placeholder="name@company.com"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {errors?.email?.message && (
                  <span className="text-sm font-bold text-red-900">
                    {errors?.email?.message}
                  </span>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  {...register("password", {
                    required: { value: true, message: "Password is required" },
                  })}
                  label="Password"
                  type="password"
                  placeholder="Enter password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {errors?.password?.message && (
                  <span className="text-sm font-bold text-red-900">
                    {errors?.password?.message}
                  </span>
                )}
              </div>

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full text-white bg-gray-900 hover:bg-gray-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Sign in
              </Button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  href={routes.signIn}
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
