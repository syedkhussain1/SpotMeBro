import React from "react";
import { UserResource } from "@clerk/types";

function ProfilePageHeader({
  user,
}: {
  user: UserResource | null | undefined;
}) {
  if (!user) return null;
  return (
    <div className="mb-10 relative backdrop-blur-sm border border-border p-6">
      <div className="flex items-center gap-4">
        <div className="relative w-20 h-20">
          {user.imageUrl ? (
            <img
              src={user.imageUrl}
              alt={user.fullName || "Profile"}
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <div className="w-full h-full rounded-xl bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
              <span className="text-3xl font-bold text-primary">
                {user.fullName?.charAt(0) || "U"}
              </span>
            </div>
          )}
          <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-gray-500">
            {user.fullName}
          </h1>
        </div>
      </div>
    </div>
  );
}

export default ProfilePageHeader;
