"use client";

import PageHeader from "@/components/page-header";
import { getUserData } from "@/utils/get-user";
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";

export default function Papers() {
  const user = getUserData();
  const [reviewers, setReviewers] = useState([]);

  const getPapers = async () => {
    const data = {
      userId: user?.id,
    };
    const response: any = await fetch("/api/get-reviewers", {
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

  useEffect(() => {
    if (user?.role === "admin") {
      getPapers();
    }
  }, [user]);

  return (
    <div className="py-3 px-4">
      <PageHeader title={"Reviewers"} />
      {user?.role === "admin" ? (
        <Table striped variant="dark">
          <thead>
            <tr>
              <th>#</th>
              <th>Id</th>
              <th>Title</th>
              <th>Email</th>
              <th>Track</th>
            </tr>
          </thead>
          <tbody>
            {reviewers?.map((paper: any, index: number) => {
              return (
                <tr>
                  <td>{index + 1}</td>
                  <td>{paper.id}</td>
                  <td>{paper.name}</td>
                  <td>{paper.email}</td>
                  <td>{paper.track}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      ) : (
        <div>You are not allowed to access this page</div>
      )}
    </div>
  );
}
