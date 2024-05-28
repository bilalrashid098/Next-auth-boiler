"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/page-header";
import { getUserData } from "@/utils/get-user";
import Button from "@/components/button";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Home() {
  const user = getUserData();
  const [date, setDate] = useState(null) as any;
  const [isLoading, setIsLoading] = useState(false);

  const getDeadline = async () => {
    const data = {
      userId: user?.id,
    };
    const response: any = await fetch("/api/deadline/get", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => res.json());
    if (response.status) {
      setDate(response.data);
    }
  };

  const updateDeadline = async () => {
    setIsLoading(true);
    const response: any = await fetch("/api/deadline/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: user.id, date: date }),
    }).then((res) => res.json());
    if (response.status) {
      setIsLoading(false);
      toast.success("Deadline updated successfully");
    }
  };

  useEffect(() => {
    getDeadline();
  }, [user]);

  return (
    <div className="py-3 px-4">
      <PageHeader title={"Setting"} />
      {user?.role === "admin" ? (
        <div>
          <div className="mb-3">
            <label className="min-w-[100px]" htmlFor="">
              Deadline:{" "}
            </label>
            <DatePicker
              className="bg-transparent border-white border-1 px-3 py-2"
              selected={date?.deadline}
              onChange={(value: any) =>
                setDate({ id: date.id, deadline: value })
              }
            />
          </div>
          <Button
            isLoading={isLoading}
            className="mt-2"
            onClick={updateDeadline}
          >
            Select
          </Button>
        </div>
      ) : (
        <div>You are not allowed to access this page</div>
      )}
    </div>
  );
}
