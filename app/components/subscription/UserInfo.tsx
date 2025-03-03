import React from "react";
import Image from "next/image";
import { UserData } from "./types";

interface UserInfoProps {
  user: UserData;
}

const UserInfo = ({ user }: UserInfoProps) => (
  <div className="flex items-center pt-4 border-t border-gray-200 dark:border-gray-700">
    <div className="flex-shrink-0">
      <Image
        src={user?.imageUrl || "https://via.placeholder.com/40"}
        alt="Profile"
        width={40}
        height={40}
        className="h-10 w-10 rounded-full"
      />
    </div>
    <div className="ml-3">
      <p className="text-sm font-medium text-gray-900 dark:text-white">
        {user?.fullName || user?.username || "User"}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {user?.primaryEmailAddress?.emailAddress || "No email provided"}
      </p>
    </div>
  </div>
);

export default UserInfo;
