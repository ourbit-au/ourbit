import ConfigDashboard from "@/components/ConfigDashboard";
import React from "react";

type Props = {};

function dashboard({}: Props) {
  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="flex-1 flex flex-col gap-20 max-w-4xl px-3 w-full">
        <div className="flex-1 flex flex-col gap-6">
          <h2 className="font-bold text-4xl mb-4">Admin Panel</h2>
          <ConfigDashboard />
        </div>
      </div>
    </div>
  );
}

export default dashboard;
