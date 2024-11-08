import React from "react";
import { getInitials } from "../../utils/helper";
import { useSelector } from "react-redux";

const ProfileInfo = () => {
  const userInfo = useSelector((state) => state.user.value);

  if (!userInfo) return null;

  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 flex items-center justify-center rounded-full text-white font-medium bg-gray-600">
        {getInitials(userInfo.fullName) || "N/A"}
      </div>
      <div>
        <p className="text-sm font-medium">{userInfo.fullName || "No Name"}</p>
      </div>
    </div>
  );
};

export default ProfileInfo;
