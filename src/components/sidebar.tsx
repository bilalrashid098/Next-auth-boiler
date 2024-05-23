import { getUserData } from "@/utils/get-user";
import Image from "next/image";
import Link from "next/link";
import Button from "./button";
import { signOut } from "next-auth/react";
import { routes } from "@/constants";

export default function Sidebar() {
  const user = getUserData();

  const authorMenu = [
    {
      label: "Papers",
      route: routes.papers,
    },
    {
      label: "Create",
      route: routes.create,
    },
    // {
    //   label: "Profile",
    //   route: routes.profile,
    // },
  ];
  const reviwerMenu = [
    {
      label: "Review",
      route: routes.review,
    },
    // {
    //   label: "Profile",
    //   route: routes.profile,
    // },
  ];
  const sidebarMenu = user?.role === "author" ? authorMenu : reviwerMenu;
  return (
    <div className="w-[300px] bg-gray-800 p-8">
      <Link
        href={routes.home}
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
      <ul className="overflow-auto h-[calc(100dvh-172px)]">
        {sidebarMenu?.map((menu: any, index: number) => {
          return (
            <li
              className="w-full rounded-[8px] bg-gray-600 mb-3 p-3"
              key={index}
            >
              <Link className="relative flex w-full h-full" href={menu.route}>
                {menu.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <Button className="p-3" onClick={() => signOut()}>
        Logout
      </Button>
    </div>
  );
}
