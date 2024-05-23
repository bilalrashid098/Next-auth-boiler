"use client";

import PageHeader from "@/components/page-header";
import { getUserData } from "@/utils/get-user";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";

export default function Home() {
  const user = getUserData();
  const [papers, setPapers] = useState([]);

  const getReviewerPapers = async () => {
    const data = {
      userId: user?.id,
    };
    const response: any = await fetch("/api/get-paper/reviewer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => res.json());
    if (response.status) {
      setPapers(response.data);
    }
  };

  useEffect(() => {
    if (user?.role === "reviewer") {
      getReviewerPapers();
    }
  }, [user]);

  return (
    <div className="py-3 px-4">
      <PageHeader title={"Papers"} />
      {user?.role === "reviewer" ? (
        <Table striped variant="dark">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Track</th>
              <th>Grade</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {papers?.map((paper: any, index: number) => {
              return (
                <tr>
                  <td>{index + 1}</td>
                  <td>{paper.title}</td>
                  <td>{paper.track}</td>
                  <td>{paper.grade ? paper.grade.grade : "NA"}</td>
                  <td>
                    <Link href={`/review/${paper.id}`}>View</Link>
                  </td>
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
